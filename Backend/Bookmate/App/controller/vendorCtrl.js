import Vendor from "../models/vendor-model.js";
import User from "../models/user-model.js";

const vendorCtrl={}

vendorCtrl.allVendors=async(req,res)=>{
    try{
        const vendors=await User.find({role:'vendor'})
        res.json(vendors)
    }catch(err){
        res.status(500).json({error:'something went wrong'})
    }
}
vendorCtrl.oneVendor=async(req,res)=>{
    try{
        const id=req.params.id
        const vendor=await User.findById(id)
        if(!vendor){
            return res.status(404).json({error:'vendor not found'})
        }
        res.json(vendor)
    }catch(err){
        res.status(500).json({error:'something went wrong'})
    }
}

// vendorCtrl.earnings = async (req, res) => {
//     try {
//       const vendorId = req.currentUser.userId;
  
//       // Fetch vendor details. Use findOne since you're looking for a single vendor
//       const vendor = await Vendor.findOne({ vendor: vendorId }).populate('totalEarnings.book');
  
//       if (!vendor) {
//         return res.status(404).json({ error: 'Vendor not found' });
//       }
  
//       // Initialize bookEarning object to store book earnings and rent count
//       const bookEarning = {};
  
//       // If totalEarnings exists and has data
//       if (vendor.totalEarnings && vendor.totalEarnings.length > 0) {
//         // Map over totalEarnings and accumulate earnings for each book
//         vendor.totalEarnings.forEach((ele) => {
//           const bookId = ele.book.toString();
  
//           // If the book already exists in bookEarning, add to the existing earnings and increment rent count
//           if (bookEarning[bookId]) {
//             bookEarning[bookId].earnings += ele.earnings;
//             bookEarning[bookId].rentCount += 1;
//           } else {
//             // Otherwise, initialize earnings and rent count for the book
//             bookEarning[bookId] = {
//               earnings: ele.earnings,
//               rentCount: 1,
//               book:ele.book
//             };
//           }
//         });
//       }
  
//       // Now `bookEarning` holds the book id as key and total accumulated earnings and rent count as value
//       res.json(bookEarning);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: "Something went wrong" });
//     }
  //};
  // vendorCtrl.earnings = async (req, res) => {
  //   try {
  //     const vendorId = req.currentUser.userId;
  
  //     // Fetch vendor details. Use findOne since you're looking for a single vendor
  //     const vendor = await Vendor.findOne({ vendor: vendorId })
  //       .populate('totalEarnings.book');  // Populate the book field inside totalEarnings array
  
  //     if (!vendor) {
  //       return res.status(404).json({ error: 'Vendor not found' });
  //     }
  
  //     // Initialize bookEarning object to store book earnings and rent count
  //     const bookEarning = {};
  
  //     // If totalEarnings exists and has data
  //     if (vendor.totalEarnings && vendor.totalEarnings.length > 0) {
  //       // Map over totalEarnings and accumulate earnings for each book
  //       vendor.totalEarnings.forEach((ele) => {
  //         if (!ele.book) {
  //         return;
  //       }
  //         const bookId = ele.book?._id.toString();  // Use the populated book field
  
  //         // If the book already exists in bookEarning, add to the existing earnings and increment rent count
  //         if (bookEarning[bookId]) {
  //           bookEarning[bookId].earnings += ele.earnings;
  //           bookEarning[bookId].rentCount += 1;
  //         } else {
  //           // Otherwise, initialize earnings and rent count for the book
  //           bookEarning[bookId] = {
  //             earnings: ele.earnings,
  //             rentCount: 1,
  //             book: ele.book  // Store the book object as part of the value
  //           };
  //         }
  //       });
  //     }
  
  //     // Now `bookEarning` holds the book id as key and total accumulated earnings and rent count as value
  //     res.json(bookEarning);
  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).json({ error: "Something went wrong" });
  //   }
  // };
  vendorCtrl.earnings = async (req, res) => {
    try {
      const vendorId = req.currentUser.userId;
  
      // Fetch vendor details and populate totalEarnings with book information
      const vendor = await Vendor.findOne({ vendor: vendorId })
        .populate('totalEarnings.book'); // Populate the book field inside totalEarnings array
  
      if (!vendor) {
        return res.status(404).json({ error: 'Vendor not found' });
      }
  
      // Use a Map to aggregate earnings and rent count by book
      const bookEarningsMap = new Map();
  
      // Loop through the current totalEarnings
      vendor.totalEarnings.forEach((entry) => {
        const bookId = entry.book?._id.toString(); 
        console.log('bookId',[bookId]) // Get the book ID
  
        if (!bookId) return; // Skip if the book ID is missing
  
        if (bookEarningsMap.has(bookId)) {
          // If the book already exists in the Map, update its earnings and increment rent count
          const existing = bookEarningsMap.get(bookId);
          bookEarningsMap.set(bookId, {
            ...existing,
            earnings: existing.earnings + entry.earnings,
            // Increment the rent count
          });
        } else {
          // If the book is not in the Map, initialize it with earnings and a rent count of 1
          // bookEarningsMap.set(bookId, {
          //   book: entry.book,
          //   earnings: entry.earnings,
          //   rentCount: 1, // Initialize rent count
          // });
         
        
          bookEarningsMap.set(bookId, {
            book: entry.book,
            earnings: entry.earnings,
            // Add to the existing rent count
          });
        }
      });
  
      // Convert the Map back to an array for saving
      const updatedEarnings = [];
      bookEarningsMap.forEach((value) => updatedEarnings.push(value));
  
      // Replace the vendor's totalEarnings array with the updated data
      vendor.totalEarnings = updatedEarnings;
  
      // Save the updated vendor document
      await vendor.save();
  
      // Respond with the updated earnings
      res.status(200).json(
         updatedEarnings,
      );
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    }
  };
  
  

export default vendorCtrl