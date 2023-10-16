package com.soen6011.careerservicebackend.response;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class LoadFile {

    private String filename;
    private String fileType;
    private String fileSize;
    private byte[] file;

}