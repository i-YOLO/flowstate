package com.flowstate.api.dto;

import java.util.UUID;

public class CategoryResponse {
    private UUID id;
    private String name;
    private String color;
    private String icon;

    public CategoryResponse() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private CategoryResponse response = new CategoryResponse();

        public Builder id(UUID id) {
            response.setId(id);
            return this;
        }

        public Builder name(String name) {
            response.setName(name);
            return this;
        }

        public Builder color(String color) {
            response.setColor(color);
            return this;
        }

        public Builder icon(String icon) {
            response.setIcon(icon);
            return this;
        }

        public CategoryResponse build() {
            return response;
        }
    }
}
