package com.ASE.Infocur.site.api;

import com.ASE.Infocur.site.dto.request.PasswordUpdateRequest;
import com.ASE.Infocur.site.dto.request.RequestClientDto;
import com.ASE.Infocur.site.entity.Client;
import com.ASE.Infocur.site.repository.ClientRepo;
import com.ASE.Infocur.site.service.ClientService;
import com.ASE.Infocur.site.utili.StandardResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.HandlerMapping;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/clients")
public class ClientController {
    private final ClientService clientService;
    private final HandlerMapping resourceHandlerMapping;
    @Autowired
    private ClientRepo clientRepo;

//    @GetMapping("/test")
//    public String test() {
//        return "Client API is working!";
//    }

    @PostMapping("/create")
    public ResponseEntity<StandardResponse> create(@RequestBody RequestClientDto dto){
        Client client = clientRepo.findByRegNumber(dto.getRegNumber());
        if(client == null && !clientRepo.existsById(dto.getRegNumber()) ) {
            clientService.save(dto);
            return new ResponseEntity<>(
                    new StandardResponse(
                            "Client saved", 201, dto
                    ), HttpStatus.CREATED
            );
        }
        return new ResponseEntity<>(
                new StandardResponse(
                        "Registration number is already exist", 409, null
                ), HttpStatus.BAD_REQUEST
        );
    }
    @GetMapping("/find-client/{id}")
    public ResponseEntity<StandardResponse> findById(
            @PathVariable String id
    ){
        return new ResponseEntity<>(
                new StandardResponse(
                        "Client-found",200,clientService.findById(id)
                ),HttpStatus.OK
        );
    }

    @PostMapping("/update-Client/{id}")
    public ResponseEntity<StandardResponse> updateById(
            @PathVariable String id,
            @RequestBody RequestClientDto dto
    ){
        clientService.updateById(dto, id);
        return new ResponseEntity<>(
               new StandardResponse(
                        "client saved",201,null
                ),HttpStatus.CREATED
        );
    }

    @DeleteMapping("/delete-client/{id}")
    public ResponseEntity<StandardResponse> deleteById(
            @PathVariable String id
    ){
        clientService.delete(id);
        return new ResponseEntity<>(
            new StandardResponse(
                    "client deleted",204,null
            ),HttpStatus.NO_CONTENT
        );
    }

    @GetMapping("/search-client")
    public ResponseEntity<StandardResponse> searchAll(
            @RequestParam String searchText,
            @RequestParam int page,
            @RequestParam int size,
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

        return new ResponseEntity<>(
                new StandardResponse(
                        "Client list",200,
                        clientService.searchAll(searchText,page,size)
                ),HttpStatus.OK
        );
    }

    @GetMapping("/profile")
    public ResponseEntity<?> profile(HttpSession  session) {
        Client client = (Client) session.getAttribute("CLIENT");

        Client dashboardClient = clientRepo.findById(client.getId()).orElse(null);
        if (client == null) {
            return ResponseEntity.status(401).body("Not logged in");
        }
        //String sessionid=session.getId();
        //System.out.println(sessionid);
        return ResponseEntity.ok(dashboardClient);
    }

    @PostMapping("/update-password")
    public ResponseEntity<StandardResponse> passwordUpdate(
            @RequestBody PasswordUpdateRequest dto,
            HttpSession session
            ){
        try{

            Client client = (Client) session.getAttribute("CLIENT");
            if (!dto.getNewPassword().equals(dto.getConfirmNewPassword())) {
               return new ResponseEntity<>(
                    new StandardResponse("password not match",400,null),HttpStatus.BAD_REQUEST
               );
            }

            clientService.passwordUpdate(client.getRegNumber(),dto.getCurrentPassword(), dto.getNewPassword());
            return new ResponseEntity<>(
                    new StandardResponse("password updated",200,null),HttpStatus.OK
            );
        }catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(
                    new StandardResponse("Error Updating password",400,null),HttpStatus.BAD_REQUEST
            );
        }
    }
}
