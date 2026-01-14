package com.flowstate.api.service;

import com.flowstate.api.dto.CategoryRequest;
import com.flowstate.api.dto.CategoryResponse;
import com.flowstate.api.entity.Category;
import com.flowstate.api.entity.User;
import com.flowstate.api.repository.CategoryRepository;
import com.flowstate.api.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public CategoryService(CategoryRepository categoryRepository, UserRepository userRepository) {
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    public List<CategoryResponse> getCategoriesForUser(UUID userId) {
        List<Category> categories = categoryRepository.findByUserId(userId);

        // If user has no categories, seed with defaults
        if (categories.isEmpty()) {
            seedDefaultCategories(userId);
            categories = categoryRepository.findByUserId(userId);
        }

        return categories.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CategoryResponse createCategory(UUID userId, CategoryRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Category category = Category.builder()
                .user(user)
                .name(request.getName())
                .color(request.getColor())
                .icon(request.getIcon())
                .build();

        Category saved = categoryRepository.save(category);
        return mapToResponse(saved);
    }

    @Transactional
    public void deleteCategory(UUID userId, UUID categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        if (!category.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        categoryRepository.delete(category);
    }

    private void seedDefaultCategories(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        categoryRepository.save(new Category(user, "工作", "indigo", "work"));
        categoryRepository.save(new Category(user, "学习", "amber", "school"));
        categoryRepository.save(new Category(user, "运动", "emerald", "fitness_center"));
        categoryRepository.save(new Category(user, "社交", "rose", "group"));
        categoryRepository.save(new Category(user, "休息", "purple", "bedtime"));
    }

    private CategoryResponse mapToResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .color(category.getColor())
                .icon(category.getIcon())
                .build();
    }
}
