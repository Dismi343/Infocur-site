package com.ASE.Infocur.site.api;

import com.ASE.Infocur.site.dto.request.RequestSessionDto;
import com.ASE.Infocur.site.entity.Client;
import com.ASE.Infocur.site.entity.Event;
import com.ASE.Infocur.site.entity.Session;
import com.ASE.Infocur.site.repository.EventRepo;
import com.ASE.Infocur.site.repository.SessionRepo;
import com.ASE.Infocur.site.service.SessionService;
import com.ASE.Infocur.site.utili.StandardResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/sessions")
public class SessionController {
    private final SessionService sessionService;
    private final EventRepo eventRepo;

    @Autowired
    private SessionRepo sessionRepo;
    @GetMapping("/test")
    public String test() {
        return "Session API is working!";
    }

    @PostMapping("/create-session")
    public ResponseEntity<StandardResponse> createSession(
            @RequestBody RequestSessionDto dto,
            HttpSession session
    ){
        Optional<Event> optionalEvent = eventRepo.findById(dto.getEventId());
        if (optionalEvent.isEmpty()) {
            return new ResponseEntity<>(
                    new StandardResponse(
                            "Event not found", 404, null
                    ), HttpStatus.NOT_FOUND
            );
        }

        System.out.print(dto.getSlotNumber());
        Event event = optionalEvent.get();
        Client client = (Client) session.getAttribute("CLIENT");
        if (client == null) {
            return new ResponseEntity<>(
                    new StandardResponse(
                            "Not logged in", 401, null
                    ), HttpStatus.BAD_REQUEST
            );
        }

//        Session existingSession = sessionRepo.findByTime(dto.getTimeSlot(), dto.getSession_type());
//        if (existingSession != null) {
//            return new ResponseEntity<>(
//                    new StandardResponse(
//                            "Session with the given time and type already exists", 400, null
//                    ), HttpStatus.BAD_REQUEST
//            );
//        }
//        if("outdoor".equals(dto.getSession_type()) && dto.getSlotNumber()> event.getOutdoor().getSessionCount()){
//
//                System.out.println(event.getOutdoor().getSessionCount());
//                return new ResponseEntity<>(
//                        new StandardResponse(
//                                "Invalid sessionNumber", 400, null
//                        ), HttpStatus.BAD_REQUEST
//                );
//        }
//         if("indoor".equals(dto.getSession_type()) && dto.getSlotNumber() > event.getIndoor().getSessionCount()){
//                System.out.println(event.getIndoor().getSessionCount());
//                System.out.println(dto.getSlotNumber() > event.getIndoor().getSessionCount());
//                return new ResponseEntity<>(
//                        new StandardResponse(
//                                "Invalid sessionNumber", 400, null
//                        ), HttpStatus.BAD_REQUEST
//                );
//
//        }



            sessionService.save(dto);

            return new ResponseEntity<>(
                    new StandardResponse(
                            "Session created successfully", 201, dto
                    ), HttpStatus.CREATED
            );

    }


    @GetMapping("/find-session/{session_id}")
    public ResponseEntity<StandardResponse> findById(
            @PathVariable String session_id,
            HttpSession session
    )
    {
        Client client = (Client)  session.getAttribute("CLIENT");
        if(client == null){
            return new ResponseEntity<>(
                    new StandardResponse(
                            "Not logged in",401,null
                    ),HttpStatus.BAD_REQUEST
            );
        }
        return new ResponseEntity<>(

                new StandardResponse(
                        "SSession found", 200, sessionService.findById(session_id)
                ), HttpStatus.OK
        );
    }
    @PutMapping("/update-session/{session_id}")
    public ResponseEntity<StandardResponse> updateById(
            @PathVariable String session_id,
            @RequestBody boolean available
           // HttpSession session
    )
    {
//        Client client = (Client)  session.getAttribute("CLIENT");
//        if(client == null){
//            return new ResponseEntity<>(
//                    new StandardResponse(
//                            "Not logged in",401,null
//                    ),HttpStatus.BAD_REQUEST
//            );
//        }
        sessionService.updateSessionById(available, session_id);

        return new ResponseEntity<>(
                new StandardResponse(
                        "Session updated successfully", 200, null
                ), HttpStatus.CREATED
        );
    }
    @DeleteMapping("/delete-session/{session_id}")
    public ResponseEntity<StandardResponse> deleteById(
        @PathVariable String session_id,
        HttpSession session
    ){
        Client client = (Client)  session.getAttribute("CLIENT");
        if(client == null){
            return new ResponseEntity<>(
                    new StandardResponse(
                            "Not logged in",401,null
                    ),HttpStatus.BAD_REQUEST
            );
        }
        sessionService.delete(session_id);
        return new ResponseEntity<>(
                new StandardResponse(
                        "Session updated successfully", 204, null
                ), HttpStatus.NO_CONTENT
        );
    }

    @GetMapping("/searchAll-session")
    public ResponseEntity<StandardResponse> searchAll(
        @RequestParam String searchText,
        @RequestParam int page,
        @RequestParam int size
    ){
        return new ResponseEntity<>(
                new StandardResponse(
                        "Session list",200,sessionService.searchAll(searchText, page, size)
                ),HttpStatus.OK
        );
    }
}
