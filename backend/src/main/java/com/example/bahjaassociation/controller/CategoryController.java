package com.example.bahjaassociation.controller;

import com.example.bahjaassociation.entity.Category;
import com.example.bahjaassociation.entity.Course;
import com.example.bahjaassociation.service.CategoryService;
import com.example.bahjaassociation.service.CourseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    private final CategoryService categoryService;
    private final CourseService courseService;

    public CategoryController(CategoryService categoryService, CourseService courseService) {
        this.categoryService = categoryService;
        this.courseService = courseService;
    }

    @PostMapping(consumes = "application/json", produces = "application/json")
    @ResponseStatus(HttpStatus.CREATED)
    public Category createCategory(@RequestBody Category category) {
        return categoryService.createCategory(category);
    }

    @GetMapping
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @GetMapping("/{categoryId}")
    public Category getCategoryById(@PathVariable Long categoryId) {
        return categoryService.getCategoryById(categoryId);
    }

    @GetMapping("/{categoryId}/courses")
    public List<Course> getCoursesByCategory(@PathVariable Long categoryId) {
        return courseService.getCoursesByCategory(categoryId);
    }

    @PutMapping(path = "/{categoryId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Category updateCategory(@PathVariable Long categoryId, @RequestBody Map<String, Object> updates) {
        Category category = categoryService.getCategoryById(categoryId);

        if (updates.containsKey("name")) {
            category.setName((String) updates.get("name"));
        }

        if (updates.containsKey("coverImageData")) {
            category.setCoverImageBase64((String) updates.get("coverImageData"));
        }

        return categoryService.createCategory(category);
    }
}