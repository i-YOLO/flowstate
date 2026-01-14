package com.flowstate.api.controller;

import com.flowstate.api.dto.CategoryRequest;
import com.flowstate.api.dto.CategoryResponse;
import com.flowstate.api.security.UserDetailsImpl;
import com.flowstate.api.service.CategoryService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private static final Logger logger = LoggerFactory.getLogger(CategoryController.class);

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public List<CategoryResponse> getMyCategories(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return categoryService.getCategoriesForUser(userDetails.getId());
    }

    @PostMapping
    public CategoryResponse createCategory(Authentication authentication, @RequestBody CategoryRequest request) {
        logger.info("Processing createCategory request for user: {}", authentication.getName());
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return categoryService.createCategory(userDetails.getId(), request);
    }

    @DeleteMapping("/{id}")
    public void deleteCategory(Authentication authentication, @PathVariable UUID id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        categoryService.deleteCategory(userDetails.getId(), id);
    }
}
