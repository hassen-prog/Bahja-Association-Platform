package com.example.bahjaassociation.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.accept.ContentNegotiationManagerFactoryBean;
import org.springframework.web.servlet.View;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.view.ContentNegotiatingViewResolver;
import org.springframework.web.servlet.view.InternalResourceViewResolver;
import org.springframework.web.servlet.view.json.MappingJackson2JsonView;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // CORS is now handled by the API Gateway and controller annotations
    /*
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
    */

    // CORS filter removed to avoid duplicate headers with gateway and controller annotations

    @Override
    public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
        configurer
                .defaultContentType(MediaType.APPLICATION_JSON)
                .mediaType("json", MediaType.APPLICATION_JSON);
    }

    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
        List<MediaType> supportedMediaTypes = new ArrayList<>();
        supportedMediaTypes.add(MediaType.APPLICATION_JSON);
        supportedMediaTypes.add(new MediaType("application", "json", java.nio.charset.StandardCharsets.UTF_8));
        supportedMediaTypes.add(new MediaType("application", "*+json"));
        converter.setSupportedMediaTypes(supportedMediaTypes);
        converters.add(converter);
    }
    @Bean
    public ContentNegotiatingViewResolver contentViewResolver() {
        ContentNegotiationManagerFactoryBean contentNegotiationManager = new ContentNegotiationManagerFactoryBean();
        contentNegotiationManager.addMediaType("json", MediaType.APPLICATION_JSON);

        InternalResourceViewResolver viewResolver = new InternalResourceViewResolver();
        viewResolver.setPrefix("/WEB-INF/jsp/");
        viewResolver.setSuffix(".jsp");

        MappingJackson2JsonView defaultView = new MappingJackson2JsonView();
        defaultView.setExtractValueFromSingleKeyModel(true);

        ContentNegotiatingViewResolver contentViewResolver = new ContentNegotiatingViewResolver();
        contentViewResolver.setContentNegotiationManager(contentNegotiationManager.getObject());
        contentViewResolver.setViewResolvers(Arrays.<ViewResolver> asList(viewResolver));
        contentViewResolver.setDefaultViews(Arrays.<View> asList(defaultView));
        return contentViewResolver;
    }
    @Bean
    public com.fasterxml.jackson.databind.Module jsonViewModule() {
        return new com.fasterxml.jackson.databind.module.SimpleModule()
                .addSerializer(
                        com.example.bahjaassociation.entity.Course.class,
                        new com.fasterxml.jackson.databind.ser.std.StdSerializer<com.example.bahjaassociation.entity.Course>(com.example.bahjaassociation.entity.Course.class) {
                            @Override
                            public void serialize(
                                    com.example.bahjaassociation.entity.Course course,
                                    com.fasterxml.jackson.core.JsonGenerator gen,
                                    com.fasterxml.jackson.databind.SerializerProvider provider
                            ) throws java.io.IOException {
                                gen.writeStartObject();
                                gen.writeNumberField("id", course.getId());
                                gen.writeStringField("title", course.getTitle());
                                gen.writeStringField("description", course.getDescription());
                                gen.writeNumberField("price", course.getPrice().doubleValue());
                                gen.writeBooleanField("free", course.getFree() != null ? course.getFree() : false);

                                // Write category ID
                                Long categoryId = course.getCategory() != null ? course.getCategory().getId() : null;
                                if (categoryId != null) {
                                    gen.writeNumberField("categoryId", categoryId);
                                }

                                // Write cover image data if available
                                if (course.getCoverImageBase64() != null) {
                                    gen.writeStringField("coverImageData", course.getCoverImageBase64());
                                }

                                // Write date fields
                                if (course.getCreatedAt() != null) {
                                    gen.writeStringField("createdAt", course.getCreatedAt().toString());
                                }
                                if (course.getUpdatedAt() != null) {
                                    gen.writeStringField("updatedAt", course.getUpdatedAt().toString());
                                }

                                // Write lessons array if available
                                if (course.getLessons() != null && !course.getLessons().isEmpty()) {
                                    gen.writeFieldName("lessons");
                                    gen.writeStartArray();
                                    for (com.example.bahjaassociation.entity.Lesson lesson : course.getLessons()) {
                                        gen.writeObject(lesson);
                                    }
                                    gen.writeEndArray();
                                }

                                gen.writeEndObject();
                            }
                        }
                );
    }



}