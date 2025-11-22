package com.ASE.Infocur.site.service.impl;

import com.ASE.Infocur.site.dto.request.RequestBookingDto;
import com.ASE.Infocur.site.dto.response.paginate.PaginateBookingDto;
import com.ASE.Infocur.site.dto.response.response.ResponseBookingDto;
import com.ASE.Infocur.site.entity.Booking;
import com.ASE.Infocur.site.entity.Client;
import com.ASE.Infocur.site.entity.ClientPackage;
import com.ASE.Infocur.site.entity.Session;
import com.ASE.Infocur.site.exception.EntryNotFoundException;
import com.ASE.Infocur.site.repository.*;
import com.ASE.Infocur.site.service.BookingService;
import com.ASE.Infocur.site.service.PhotoProgressService;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {
    private final BookingRepo bookingRepo;
    private final ClientRepo clientRepo;
    private final SessionRepo sessionRepo;
    private final PackageRepo packageRepo;

    private final PhotoProgressService photoProgressService;
    private final PhotoProgressRepo photoProgressRepo;

    @Override
    public void save(RequestBookingDto requestBookingDto) {

        Session session= sessionRepo.findById(requestBookingDto.getSessionId())
                .orElseThrow(()-> new EntryNotFoundException("No Session found"));

        if (!session.isAvailable()) {
            throw new RuntimeException("Slot already booked");
        }

        session.setAvailable(false);
        sessionRepo.save(session);

        Booking booked=  bookingRepo.save(toBooking(requestBookingDto));

      System.out.println("booking id"+booked.getBookingId()+"evetn id"+ booked.getSession().getEventId().getEventId());

        photoProgressService.createProgress(
                booked.getClient().getId(),
                booked.getSession().getEventId().getEventId(),
                booked.getBookingId()
        );

    }

    private Booking toBooking(RequestBookingDto dto) {
        if(dto==null) return null;
        Client client = clientRepo.findById(dto.getClientId()).orElse(null);
        Session session = sessionRepo.findById(dto.getSessionId()).orElse(null);
        ClientPackage pkg = packageRepo.findById(dto.getPackageId()).orElse(null);
        return Booking.builder()
                .bookingId(UUID.randomUUID().toString())
                .client(client)
                .session(session)
                .clientPackageInfo(pkg)
                .date(LocalDate.now())
                .status(dto.getStatus())
                .slipFile(dto.getSlipFile())
                .slipUrl(dto.getSlipUrl())
                .build();
    }

    @Override
    public void delete(String id) {

        Booking booking = bookingRepo.findById(id).orElseThrow(() -> new EntryNotFoundException("No Booking found"));
        Session session = booking.getSession();
        if (session != null) {
            session.setAvailable(true);
            sessionRepo.save(session);
        }

        bookingRepo.deleteById(id);

        photoProgressRepo.findByBooking_BookingId(id).ifPresent(photoProgress -> {
            photoProgressRepo.delete(photoProgress);
        });
    }

    @Override
    public ResponseBookingDto finById(String id) {
        return toResponseBookingDto(bookingRepo.findById(id).orElseThrow(()->new EntryNotFoundException("No Booking found")));

    }
    private ResponseBookingDto toResponseBookingDto(Booking booking) {
        if(booking==null) return null;
        return ResponseBookingDto.builder()
                .bookingId(booking.getBookingId())
                .clientId(booking.getClient())
                .sessionId(booking.getSession())
                .packageId(booking.getClientPackageInfo())
                .date(booking.getDate())
                .status(booking.getStatus())
                .slipFile(booking.getSlipFile())
                .slipUrl(booking.getSlipUrl())
                .build();
    }

    @Override
    public void updateById(RequestBookingDto requestBookingDto, String id) {
        if (id == null) {
            throw new IllegalArgumentException("Booking id must not be null");
        }
        Booking booking = bookingRepo.findById(id).orElseThrow(() -> new EntryNotFoundException("No Booking found"));
        booking.setClient(clientRepo.findById(requestBookingDto.getClientId()).orElseThrow(() -> new EntryNotFoundException("No Client found")));
        booking.setSession(sessionRepo.findById(requestBookingDto.getSessionId()).orElseThrow(() -> new EntryNotFoundException("No Session found")));
        booking.setClientPackageInfo(packageRepo.findById(requestBookingDto.getPackageId()).orElseThrow(() -> new EntryNotFoundException("No package found")));
        booking.setDate(LocalDate.now());
        booking.setStatus(requestBookingDto.getStatus());
        booking.setSlipFile(requestBookingDto.getSlipFile());
        booking.setSlipUrl(requestBookingDto.getSlipUrl());
        bookingRepo.save(booking);
    }

    @Override
    public PaginateBookingDto searchAll(String searchText, int page, int size) {
        Page<Booking> bookings = bookingRepo.searchAll(searchText, PageRequest.of(page,size));
        return PaginateBookingDto.builder()
                .dataList(bookings.stream()
                        .map(e->toResponseBookingDto(e))
                        .toList()
                )
                .count(bookings.getTotalElements())
                .build();
    }

    @Override
    public PaginateBookingDto searchAllByClient(String searchText, int page, int size, String clientId) {
        Page<Booking> bookings = bookingRepo.searchAllByClient(searchText, PageRequest.of(page, size), clientId);
        return PaginateBookingDto.builder()
                .dataList(bookings.stream()
                        .map(e->toResponseBookingDto(e))
                        .toList())
                .count(bookings.getTotalElements())
                .build();
    }

    @Override
    public PaginateBookingDto searchAllByEvent(String searchText, int page, int size, String eventId) {
        if (eventId == null || eventId.isBlank()) {
            return PaginateBookingDto.builder()
                    .dataList(Collections.emptyList())
                    .count(0)
                    .build();
        }

        PageRequest pageable = PageRequest.of(page, size);

        List<Session> sessions = sessionRepo.findByEventIdEventId(eventId);


        Page<Booking> bookings = bookingRepo.findBySessionIn(sessions, pageable);



        return PaginateBookingDto.builder()
                .dataList(bookings.stream()
                        .map(this::toResponseBookingDto)
                        .toList())
                .count(bookings.getTotalElements())
                .build();
    }

    @Override
    public void updateStatus(String id, String status) {
        Booking booking = bookingRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(status);
        bookingRepo.save(booking);
    }
}
