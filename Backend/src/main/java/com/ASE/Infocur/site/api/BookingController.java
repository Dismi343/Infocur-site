package com.ASE.Infocur.site.api;

import com.ASE.Infocur.site.dto.request.RequestBookingDto;
import com.ASE.Infocur.site.entity.Booking;
import com.ASE.Infocur.site.entity.Client;
import com.ASE.Infocur.site.entity.Event;
import com.ASE.Infocur.site.entity.Session;
import com.ASE.Infocur.site.repository.BookingRepo;
import com.ASE.Infocur.site.repository.EventRepo;
import com.ASE.Infocur.site.repository.SessionRepo;
import com.ASE.Infocur.site.service.BookingService;
import com.ASE.Infocur.site.service.S3Service;
import com.ASE.Infocur.site.utili.StandardResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {
    private final BookingService bookingService;
    private final BookingRepo bookingRepo;
    private final SessionRepo sessionRepo;
    private final EventRepo eventRepo;

    @Autowired
    private S3Service s3Service;


    @PostMapping("/upload")
    public ResponseEntity<StandardResponse> upload(
            @RequestParam MultipartFile file
    )throws IOException {
        s3Service.uploadFile(file);
        return new ResponseEntity<>(
                new StandardResponse(
                        "File uploaded successfully", 200, null
                ), HttpStatus.OK
        );
    }

    @GetMapping("/download/{fileName}")
    public ResponseEntity<byte[]> download(
            @PathVariable String fileName
    ){
//        Client client=(Client) session.getAttribute("client");
//        if (client == null) {
//            System.out.println("client is null");
//            return null;
//        }
        byte[] data=s3Service.downLoadFile(fileName);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,"attached filename = "+fileName)
                .body(data);

    }

    @PostMapping("/create")
    public ResponseEntity<StandardResponse> create(
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestPart("data") RequestBookingDto dto,
            HttpSession session
    ) throws IOException {
        Client client = (Client) session.getAttribute("CLIENT");
        Booking sessionExist = bookingRepo.findBySession_SessionId(dto.getSessionId());

        Session sessionValid = sessionRepo.findBySessionId(dto.getSessionId());

        if (client == null) {
            return new ResponseEntity<>(
                    new StandardResponse(
                            "Not logged in", 401, null
                    ), HttpStatus.BAD_REQUEST
            );
        } else if (sessionExist != null) {
            return new ResponseEntity<>(
                    new StandardResponse(
                            "Booking already exists for this session", 400, null
                    ), HttpStatus.BAD_REQUEST
            );
        } else if (sessionValid == null) {
            System.out.println(dto.getSessionId());
            return new ResponseEntity<>(
                    new StandardResponse(
                            "Invalid session", 400, null
                    ), HttpStatus.BAD_REQUEST
            );
        }

        dto.setClientId(client.getId());
        dto.setSlipUrl(s3Service.uploadFile(file));
        dto.setSlipFile(s3Service.getFileName());

       // System.out.println(file.getOriginalFilename());
        System.out.println("fileUrl"+dto.getSlipUrl());
        System.out.println("fileName"+s3Service.getFileName());
        System.out.println(dto.getPackageId());
        bookingService.save(dto);
        return new ResponseEntity<>(
                new StandardResponse(
                        "Booking created successfully", 201, dto
                ), HttpStatus.CREATED
        );
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<StandardResponse> findById(
            @PathVariable String id
    ) {
        return new ResponseEntity<>(
                new StandardResponse(
                        "Booking found", 200, bookingService.finById(id)
                ),HttpStatus.OK
        );
    }

    //---------------------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------------------


    @PutMapping("/update/{id}")
    public ResponseEntity<StandardResponse> updateById(
            @PathVariable String id,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestPart("data") RequestBookingDto dto,
            HttpSession session
    ) throws IOException {
        Client client = (Client) session.getAttribute("CLIENT");

        if (client == null) {
            return new ResponseEntity<>(
                    new StandardResponse(
                            "Not logged in", 401, null
                    ), HttpStatus.BAD_REQUEST
            );
        }

        if (file != null && !file.isEmpty()) {
            try {
                String fileUrl = s3Service.uploadFile(file);
                dto.setSlipUrl(fileUrl);
                dto.setSlipFile(s3Service.getFileName());
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload file", e);
            }
        } else {
            Booking existingBooking = bookingRepo.findById(id).orElseThrow(() -> new RuntimeException("Booking not found"));
            dto.setSlipUrl(existingBooking.getSlipUrl());
            dto.setSlipFile(existingBooking.getSlipFile());
        }
        // Ensure slipUrl and slipFile are updated in the database

//        dto.setSlipUrl(s3Service.uploadFile(file));
//        dto.setSlipFile(s3Service.getFileName());
        dto.setClientId(client.getId());
        bookingService.updateById(dto, id);

        return new ResponseEntity<>(
                new StandardResponse(
                        "Booking updated successfully", 200, null
                ), HttpStatus.OK
        );
    }

    //---------------------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------------------


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<StandardResponse> delete(
            @PathVariable String id
    ) {
       Booking booking = bookingRepo.findById(id).orElseThrow(() -> new RuntimeException("Booking not found"));
       String fileName = booking.getSlipFile();
        if(s3Service.deleteFile(fileName)){
            bookingService.delete(id);
            return new ResponseEntity<>(
                    new StandardResponse(
                            "Booking deleted successfully", 204, null
                    ), HttpStatus.NO_CONTENT
            );
        }
        return new ResponseEntity<>(
                new StandardResponse(
                        "Failed to delete booking", 500, null
                ), HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    @GetMapping("/searchAll-bookings")
    public ResponseEntity<StandardResponse> searchAll(
            @RequestParam String searchText,
            @RequestParam int page,
            @RequestParam int size
    ) {
        return new ResponseEntity<>(
                new StandardResponse(
                        "Booking list",200,bookingService.searchAll(searchText, page, size)
                ),HttpStatus.OK
        );
    }

    @GetMapping("/searchAllByClient")
    public ResponseEntity<StandardResponse> searchAllByClient(
            @RequestParam String searchText,
            @RequestParam int page,
            @RequestParam int size,
            HttpSession session
    ) {
        Client client = (Client) session.getAttribute("CLIENT");
        if (client == null) {
            return new ResponseEntity<>(
                    new StandardResponse("Not logged in", 401, null),
                    HttpStatus.UNAUTHORIZED
            );
        }


        return new ResponseEntity<>(
                new StandardResponse(
                        "Booking list", 200,
                        bookingService.searchAllByClient(searchText, page, size, client.getId())
                ),
                HttpStatus.OK
        );
    }

    @GetMapping("/searchAllByEvent/{eventId}")
    public ResponseEntity<StandardResponse> searchAllBySession(
            @RequestParam(required = false, defaultValue = "") String searchText,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int size,
            @PathVariable String eventId
    ){

        if (eventId == null || eventId.isBlank()) {
            return ResponseEntity.badRequest().body(new StandardResponse("Missing eventId", 400, null));
        }

        return new ResponseEntity<>(
                new StandardResponse(
                        "Booking list", 200,
                        bookingService.searchAllByEvent(searchText, page, size, eventId)
                ),
                HttpStatus.OK
        );
    }


    //---------------------------------------------
    //-----------------------------------------------

    @GetMapping("/images/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        byte[] imageData = s3Service.downLoadFile(filename);

        // Create a ByteArrayResource from the image data
        ByteArrayResource resource = new ByteArrayResource(imageData);

        // Determine content type based on file extension
        String contentType = getContentType(filename);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .contentLength(imageData.length)
                .body(resource);
    }

    private String getContentType(String filename) {
        String extension = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
        return switch (extension) {
            case "jpg", "jpeg" -> "image/jpeg";
            case "png" -> "image/png";
            case "gif" -> "image/gif";
            case "bmp" -> "image/bmp";
            case "webp" -> "image/webp";
            default -> "application/octet-stream";
        };
    }

    @PutMapping("/approve/{id}/status")
    public ResponseEntity<String> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body
    ) {

        String status = body.get("status");
        bookingService.updateStatus(id, status);
        return ResponseEntity.ok("Status updated");
    }

}
