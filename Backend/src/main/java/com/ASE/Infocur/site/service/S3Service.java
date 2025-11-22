package com.ASE.Infocur.site.service;

import com.ASE.Infocur.site.entity.Booking;
import com.ASE.Infocur.site.repository.BookingRepo;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.awt.print.Book;
import java.io.IOException;
import java.util.Date;
import java.util.Objects;

@Service
public class S3Service {
    @Autowired
    private S3Client s3Client;

    @Value("${aws.bucket.name}")
    private String bucketName;

    @Getter
    private String fileName;

    @Value("${cloud.aws.s3.endpoint}")
    private String endpoint;

    public String uploadFile(MultipartFile file) throws  IOException{
         fileName= generateFileName(file);
        String fileUrl=endpoint + "/" + fileName;
        s3Client.putObject(PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(fileName)
                        .build(),
                        RequestBody.fromBytes(file.getBytes()));


        return fileUrl;

    }

    public boolean deleteFile(String fileUrl){
        String fileName=fileUrl.substring(fileUrl.lastIndexOf("/")+1);
        s3Client.deleteObject(DeleteObjectRequest.builder()
            .bucket(bucketName)
            .key(fileName)
            .build());
        return true;
    }

    public byte[] downLoadFile(String key){
        ResponseBytes<GetObjectResponse>
                objectAsBytes=s3Client.getObjectAsBytes(GetObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                .build());
        return objectAsBytes.asByteArray();
    }




    public String generateFileName(MultipartFile multiPart) {
        return new Date().getTime() + "-" + Objects.requireNonNull(multiPart.getOriginalFilename()).replace(" ", "_");
    }
}
