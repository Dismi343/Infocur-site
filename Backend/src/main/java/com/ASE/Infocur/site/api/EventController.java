package com.ASE.Infocur.site.api;

import com.ASE.Infocur.site.dto.request.RequestEventDto;
import com.ASE.Infocur.site.service.EventService;
import com.ASE.Infocur.site.utili.StandardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/events")
public class EventController {
    private final EventService eventService;
    @PostMapping("/create")
    public ResponseEntity<StandardResponse> create(
            @RequestBody RequestEventDto dto
            ){
        eventService.save(dto);
        return new ResponseEntity<>(
                new StandardResponse(
                        "Event Created",200,dto
                ), HttpStatus.CREATED
        );
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<StandardResponse> delete(
            @PathVariable String id
    ){
        eventService.delete(id);
        return new ResponseEntity<>(
                new StandardResponse(
                        "Event Deleted",204,null
                ), HttpStatus.NO_CONTENT
        );
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<StandardResponse> updateById(
            @PathVariable String id,
            @RequestBody RequestEventDto dto
    ){
        eventService.updateById(dto, id);
        return new ResponseEntity<>(
                new StandardResponse(
                        "Event updated", 200 , null
                ),HttpStatus.CREATED
        );
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<StandardResponse> findById(
            @PathVariable String id
    ){
        return new ResponseEntity<>(
                new StandardResponse(
                        "Event Found", 200, eventService.findById(id)
                ), HttpStatus.OK
        );
    }

    @GetMapping("/search")
    public ResponseEntity<StandardResponse> searchAll(
            @RequestParam String searchText,
            @RequestParam int page,
            @RequestParam int size
    ){
        return new ResponseEntity<>(
                new StandardResponse(
                        "Search Results",
                        200,
                        eventService.searchAll(searchText, page, size
                )
        ), HttpStatus.OK
        );
    }

    //==========================================================================================
    //==========================================================================================

    @GetMapping("/slots/{eventId}")
    public ResponseEntity<StandardResponse> getSlots(
            @PathVariable String eventId
    ){
        return new ResponseEntity<>(
                new StandardResponse(
                        "Time Slots for Event",
                        200,
                        eventService.getAvailableSlots(eventId)
                ), HttpStatus.OK
        );
    }
}
