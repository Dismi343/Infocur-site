import * as React from 'react';
import {useState} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';


export default function TableEventBookings({bookings = [], onRefresh}) {

   // image preview state
   const [previewUrl, setPreviewUrl] = React.useState(null);
   const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
   const [isPreviewLoading, setIsPreviewLoading] = React.useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedBookingForDelete, setSelectedBookingForDelete] = useState(null);

    const [localBookings, setLocalBookings] = React.useState(bookings);

    React.useEffect(() => {
        setLocalBookings(bookings);
    }, [bookings]);

    const updateBookingStatusLocally = (bookingId, status) => {
        setLocalBookings(prev => prev.map(b => b.bookingId === bookingId ? { ...b, status } : b));
    };

    const safeOnRefresh = typeof onRefresh === 'function' ? onRefresh : () => {};

    const handleDownload = async(file)=>{
       try{
            console.log(file);

           // build image url (same as before)
           const imageUrl = `/api/bookings/images/${file}`;

           // open in-window preview instead of new tab
           setPreviewUrl(imageUrl);
           setIsPreviewLoading(true);
           setIsPreviewOpen(true);
       }
       catch(error){
           console.log(error);
       }
   }

    const deleteEvent =async (id)=>{
        try{
            const res = await axios.delete(`/api/bookings/delete/${id}`,{
                withCredentials:true
            });

            console.log('Booking deleted:', res.data);
            setLocalBookings((prev) => prev.filter((b) => b.bookingId !== id));
        }
        catch(error){
            console.error('Error Booking event:', error);
        }
    };

    const confirmDelete = (event) => {
        setSelectedBookingForDelete(event);
        setShowDeleteConfirm(true);
    };

   const handleConfirmDelete= async()=>{
        console.log("deleting bookingId "+selectedBookingForDelete);
        if(!selectedBookingForDelete) return ;

       await deleteEvent(selectedBookingForDelete);
       setShowDeleteConfirm(false);
       setSelectedBookingForDelete(null);
   }

   const handleCancelDelete=()=>{
       setShowDeleteConfirm(false);
       setSelectedBookingForDelete(null);
   }

    return (
        <>
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-lg">
                        <h3 className="text-lg font-semibold mb-4">Do you want to delete the event?</h3>
                        {selectedBookingForDelete && (
                            <p className="text-sm text-gray-600 mb-4">{selectedBookingForDelete.eventName || selectedBookingForDelete.name}</p>
                        )}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={handleCancelDelete}
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                            >
                                No
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
            <Table
                sx={{
                    minWidth: 650,
                    backgroundColor: 'transparent',
                    // ensure all MUI table cells use white text and remove borders (force with !important)
                    borderCollapse: 'separate',
                    borderSpacing: '0 10px', // 10px vertical spacing between rows
                    '& .MuiTableCell-root': { color: '#ffffff', borderBottom: 'none !important', fontWeight: 700 },
                    '& .MuiTableRow-root': { borderBottom: 'none !important' },
                    '& td, & th': { borderBottom: 'none !important' },
                    // add vertical padding: header cells get extra bottom padding (10px more) to create space after header
                    '& .MuiTableHead-root .MuiTableCell-root': { pt: '10px', pb: '20px' },
                    '& .MuiTableBody-root .MuiTableCell-root': { py: '10px' },
                    // apply semi-transparent row background only to table body cells (not the head)
                    // and give each body row rounded corners by rounding first/last cells
                    '& .MuiTableBody-root .MuiTableRow-root .MuiTableCell-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        color: '#4682B4',
                        fontWeight: 700
                    },
                    "& th:first-of-type": { borderTopLeftRadius: "8px", borderBottomLeftRadius: "8px" },
                    "& td:last-of-type": { borderTopRightRadius: "8px", borderBottomRightRadius: "8px" }

                }}
                aria-label="simple table"
            >
                <TableHead>
                    <TableRow>
                        <TableCell>No</TableCell>
                        <TableCell >Name</TableCell>
                        <TableCell >Contact No</TableCell>
                        <TableCell >Email</TableCell>
                        <TableCell >Packages</TableCell>
                        <TableCell >Type</TableCell>
                        <TableCell >Created Date</TableCell>
                        <TableCell >Time</TableCell>
                        <TableCell >Payment Slip</TableCell>
                        <TableCell >Approval</TableCell>
                        <TableCell>Delete Booking</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {localBookings.map((booking,index) => (
                        <TableRow
                            key={booking.bookingId || index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {index + 1}
                            </TableCell>
                            <TableCell >{booking.clientId.fullName}</TableCell>
                            <TableCell >
                                <a href={`tel:${booking.clientId.mnumber}`} className=" hover:cursor-pointer">
                                    {booking.clientId.mnumber}
                                </a>
                            </TableCell>
                            <TableCell >
                                <a href={`mailto:${booking.clientId.email}`} className=" hover:cursor-pointer">
                                    {booking.clientId.email}
                                </a>
                            </TableCell>
                            <TableCell >{booking.packageId.packageName}</TableCell>
                            <TableCell >{booking.sessionId.sessionType}</TableCell>
                            <TableCell >{booking.date}</TableCell>
                            <TableCell >{booking.sessionId.startTime}</TableCell>
                            <TableCell><button onClick={()=>handleDownload(booking.slipFile)} className="hover:bg-white">Preview slip</button></TableCell>
                            <TableCell>
                                <input
                                    type="checkbox"
                                    checked={booking.status === "true"}
                                    onChange={async (e) => {
                                         const newStatus = e.target.checked ? "true" : "false";

                                        const prevStatus = booking.status;

                                        // optimistic update
                                        updateBookingStatusLocally(booking.bookingId, newStatus);

                                        try {
                                            await axios.put(
                                                `/api/bookings/approve/${booking.bookingId}/status`,
                                                { status: newStatus },
                                                { withCredentials: true }
                                            );
                                            // call parent refresh if provided
                                            safeOnRefresh();
                                        } catch (err) {
                                            console.error("Failed to update status:", err);
                                            // rollback on error
                                            updateBookingStatusLocally(booking.bookingId, prevStatus);
                                        }
                                    }}
                                />
                            </TableCell>
                            <TableCell>
                                <button className={` border w-30 h-10 rounded-lg text-white ${
                                    booking.status === "true"
                                        ? "bg-gray-500 cursor-not-allowed"
                                        : "bg-red-500 hover:bg-red-600 hover:cursor-pointer"
                                }`}
                                        onClick={()=>confirmDelete(booking.bookingId)}
                                        disabled={booking.status === "true"}>
                                            delete
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>

        {/* Image preview modal (in-window) */}
        {isPreviewOpen && (
            <div
                onClick={() => { setIsPreviewOpen(false); setPreviewUrl(null); setIsPreviewLoading(false); }}
                style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: '90%', maxHeight: '90%', background: '#fff', borderRadius: 8, padding: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button onClick={() => { setIsPreviewOpen(false); setPreviewUrl(null); setIsPreviewLoading(false); }} style={{ background: 'transparent', border: 'none', fontSize: 18, cursor: 'pointer' }}>✕</button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', maxHeight: '80vh', overflow: 'auto', minWidth: 300 }}>
                        {/* spinner shown while loading */}
                        {isPreviewLoading && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 64, height: 64, borderRadius: 32, border: '6px solid #e0e0e0', borderTop: '6px solid #2A8ACE', animation: 'spin 1s linear infinite' }}></div>
                                <div style={{ color: '#333' }}>Loading image...</div>
                            </div>
                        )}

                        {/* image is rendered but hidden until onLoad fires (we still set src so browser starts loading) */}
                        <img
                            src={previewUrl}
                            alt="Preview"
                            onLoad={() => setIsPreviewLoading(false)}
                            onError={() => { setIsPreviewLoading(false); /* optionally show error UI */ }}
                            style={{ display: isPreviewLoading ? 'none' : 'block', maxWidth: '100%', maxHeight: '80vh', borderRadius: 6 }}
                        />
                    </div>
                </div>
            </div>
        )}

        {/* spinner keyframes style (inlined) */}
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </>
    );
}
