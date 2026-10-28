package com.example.bahjaassociation.controller;

import com.example.bahjaassociation.entity.Video;
import com.example.bahjaassociation.repository.VideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/videos")
public class VideoController {

    @Autowired
    private VideoRepository videoRepository;

    @GetMapping
    public List<Video> getAllVideos() {
        return videoRepository.findAll();
    }

    @PostMapping
    public Video addVideo(@RequestBody Video video) {
        return videoRepository.save(video);
    }


    @PutMapping("/{id}")
    public ResponseEntity<Video> updateVideo(@PathVariable Long id, @RequestBody Video videoDetails) {
        Optional<Video> videoOptional = videoRepository.findById(id);
        if (!videoOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Video video = videoOptional.get();
        video.setTitle(videoDetails.getTitle());
        video.setVideoId(videoDetails.getVideoId());
        final Video updatedVideo = videoRepository.save(video);
        return ResponseEntity.ok(updatedVideo);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVideo(@PathVariable Long id) {
        if (!videoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        videoRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

}
