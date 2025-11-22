package com.ASE.Infocur.site.api;


import com.ASE.Infocur.site.dto.request.RequestPhotoProgressDto;
import com.ASE.Infocur.site.dto.response.response.ResponsePhotoProgressDto;
import com.ASE.Infocur.site.entity.Client;
import com.ASE.Infocur.site.entity.PhotoProgress;
import com.ASE.Infocur.site.repository.BookingRepo;
import com.ASE.Infocur.site.repository.EventRepo;
import com.ASE.Infocur.site.repository.PhotoProgressRepo;
import com.ASE.Infocur.site.service.PhotoProgressService;
import com.ASE.Infocur.site.utili.StandardResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/photo-progress")
public class PhotoProgressController {

    private final PhotoProgressService photoProgressService;
    private final BookingRepo bookingRepo;
    private final EventRepo eventRepo;
    private final PhotoProgressRepo photoProgressRepo;

    @PostMapping("/create")
    public ResponseEntity<StandardResponse> create(
            @RequestBody RequestPhotoProgressDto photoProgress,
            HttpSession session
    ){
        Client client = (Client) session.getAttribute("CLIENT");
        if(client == null) {
            return new ResponseEntity<>(
                    new StandardResponse(
                            "Not logged in", 401, null
                    ), HttpStatus.BAD_REQUEST
            );
        }
        photoProgress.setClientId(client.getId());
        photoProgressService.save(photoProgress);

        return new ResponseEntity<>(
                new StandardResponse(
                        "photoProgress Created", 201, photoProgress
                ), HttpStatus.CREATED
        );
    }

    @GetMapping("/find-progress/{id}")
    public ResponseEntity<StandardResponse> findById(
            @PathVariable String id
    ){
        return new ResponseEntity<>(
                new StandardResponse(
                        "progress Found",
                        200,
                        photoProgressService.findById(id)
                ),HttpStatus.OK
        );
    }

    @PutMapping("/update-progress/{id}")
    public ResponseEntity<StandardResponse> updateById(
            @PathVariable String id,
            @RequestBody RequestPhotoProgressDto dto

    ){

        photoProgressService.updateById(dto,id);

        return new ResponseEntity<>(
                new StandardResponse(
                        "Progress updated",
                        201,
                        null
                ),HttpStatus.CREATED
        );
    }

    @DeleteMapping("/delete-progress/{id}")
    public ResponseEntity<StandardResponse> deleteById(
            @PathVariable String id
    ){
        photoProgressService.delete(id);
        return new ResponseEntity<>(
                new StandardResponse(
                        "progress deleted",204,null
                ),HttpStatus.NO_CONTENT
        );
    }


    @GetMapping("/search-all")
    public ResponseEntity<StandardResponse> searchAll(
            @RequestParam String searchText,
            @RequestParam int page,
            @RequestParam int size
    ){
        return  new ResponseEntity<>(
                new StandardResponse(
                        "progress list",
                        200,
                        photoProgressService.searchAll(searchText,page,size)
                ),HttpStatus.OK
        );
    }

    //----------------------------------------------------------------------
    //create progress when booking created by client
    //----------------------------------------------------------------------

    @PostMapping("/create-progress")
    public ResponseEntity<StandardResponse> createProgress(
            @RequestParam String clientId,
            @RequestParam String eventId,
            @RequestParam String bookingId
    ){
        photoProgressService.createProgress(clientId, eventId, bookingId);
        return new ResponseEntity<>(
                    new StandardResponse(
                            "created",
                            201,
                            null
                    ),HttpStatus.CREATED
                );
    }

    //----------------------------------------------------------------------
    //----------------------------------------------------------------------


    //----------------------------------------------------------------------
    //update status by admin
    //----------------------------------------------------------------------

    @PutMapping("/update-status/{id}")
    public ResponseEntity<String> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body
    ) {

        String status = body.get("status");
        photoProgressService.updateStatus(id, status);
        return ResponseEntity.ok("Status updated");
    }

    //----------------------------------------------------------------------
    //----------------------------------------------------------------------

    @PutMapping("/update-fields/{id}")
    public ResponseEntity<String> updateFields(
            @PathVariable String id,
            @RequestBody Map<String, Object> body
    ){

        ResponsePhotoProgressDto current = photoProgressService.findById(id);

        // parse img_number safely (handle Number or String or missing)
        Integer imgNumber = null;
        if (body.containsKey("img_number")) {
            Object imgObj = body.get("img_number");
            if (imgObj instanceof Number) {
                imgNumber = ((Number) imgObj).intValue();
            } else if (imgObj != null) {
                try {
                    imgNumber = Integer.parseInt(imgObj.toString());
                } catch (NumberFormatException e) {
                    // optional: return bad request or fallback to current value
                    return ResponseEntity.badRequest().body("Invalid img_number");
                }
            }
        }

        // parse d_link safely
        String dLink = null;
        if (body.containsKey("d_link")) {
            Object linkObj = body.get("d_link");
            dLink = linkObj == null ? null : linkObj.toString();
        }

        // fallback to existing values when a field was not provided
        int finalImg = imgNumber != null ? imgNumber : (current != null  ? current.getImg_number() : 0);
        String finalLink = dLink != null ? dLink : (current != null ? current.getD_link() : null);

        // call service method that expects typed values
        photoProgressService.udpatefields(id, finalImg, finalLink);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/search-by-booking/{bookingId}")
    public ResponseEntity<StandardResponse> searchByBooking(
            @PathVariable String bookingId,
            @RequestParam(required = false, defaultValue = "") String searchText,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int size
    ){
        if(bookingId == null || bookingId.isBlank()) {
            return ResponseEntity.badRequest().body(new StandardResponse("Missing eventId", 400, null));
        }
        return new ResponseEntity<>(
                new StandardResponse(
                        "progress list",
                        200,
                        photoProgressService.searchByBookingId(searchText,page,size,bookingId)
                ),HttpStatus.OK
        );
    }

    @GetMapping("/search-by-event/{eventId}")
    public ResponseEntity<StandardResponse> searchByEvent(
            @PathVariable String eventId,
            @RequestParam(required = false, defaultValue = "") String searchText,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int size
    ){
        if(eventId == null || eventId.isBlank()) {
            return ResponseEntity.badRequest().body(new StandardResponse("Missing eventId", 400, null));
        }
        return new ResponseEntity<>(
                new StandardResponse(
                        "Progress List for Event",
                        200,
                        photoProgressService.searchByEventId(searchText,page,size,eventId)
                ),HttpStatus.OK
        );
    }

}
