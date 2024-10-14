const express = require('express');
const Attendence = require('../models/Attendence');



const router = express.Router();

const formatTime =(date)=>{
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;

}

function calculateTimeDifference(a, b) {
    // Extract hours and minutes from strings
    const a_hours_int = parseInt(a.slice(0, 2));
    const a_minutes_int = parseInt(a.slice(3, 5));
    const b_hours_int = parseInt(b.slice(0, 2));
    const b_minutes_int = parseInt(b.slice(3, 5));

    let hours, minutes;

    // Calculate the difference
    if (a_minutes_int >= b_minutes_int) {
        hours = a_hours_int - b_hours_int;
        minutes = a_minutes_int - b_minutes_int;
    } else {
        hours = a_hours_int - b_hours_int - 1;
        minutes = a_minutes_int - b_minutes_int + 60;
    }

    // Output the result
    // console.log(`${hours}:${minutes < 10 ? '0' + minutes : minutes}`);
    return `${hours< 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
}



router.post('/checkin', async(req,res)=>{
    try{
        
        const {userId,location,inTime} = req.body;
        const currentDate = new Date();
        const existingAtt = await Attendence.findOne({
            userId:userId,
            date: currentDate.toISOString().split('T')[0],
            inTime:inTime,
        });

        // if(existingAtt.outTime){
        //     console.log(existingAtt.outTime);
        // }

        if(existingAtt&&!existingAtt.outTime){
            return res.status(404).json({message:'already checked in '});
        }

        

        const attendence = new Attendence({
            userId:userId,
            date: currentDate.toISOString().split('T')[0],
            inTime:formatTime(currentDate),
            location:location,
        });

        await attendence.save();
        res.status(201).json({inTime:attendence.inTime});


    }
    catch(err){
        console.log(err.message);
        res.status(500).json({message:"unsuccessfull checkin"});

    }
    





});

// check-out route
router.post('/checkout', async (req, res) => {
  try {
    const { userId, location,inTime } = req.body;
    const currentDate = new Date();
    const formattedTime = formatTime(currentDate);

    const workingHours = calculateTimeDifference(formattedTime,inTime);


    // Find the attendance record for the current day by userId and date
    const attendance = await Attendence.findOneAndUpdate(
      {
        userId: userId,
        date: currentDate.toISOString().split('T')[0],
        inTime:inTime, // Match the current date & time
      },
      {
        outTime: formattedTime, // Update outTime
        workingHours:workingHours,
        // locationOut: location, // Optional: Update location for check-out
      },
      { new: true } // Return the updated document
    );

    if (!attendance) {
      return res.status(404).json({ message: 'No check-in record found for today' });
    }

    res.status(200).json({ message: 'Check-out successful', attendance });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Unsuccessful check-out" });
  }
});


// routes/attendence.js
router.get('/history/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const attendenceHistory = await Attendence.find({ userId } ).sort({createdAt:-1});
      res.status(200).json(attendenceHistory);
    } catch (err) {
      res.status(500).json({ message: "Error fetching attendance history" });
    }
});


  
module.exports = router;
