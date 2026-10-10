package com.pbfm.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.format.FormatterRegistry;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.UUID;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addConverter(new StringToUuidConverter());
    }

    public static class StringToUuidConverter implements Converter<String, UUID> {
        @Override
        public UUID convert(@NonNull String source) {
            if (source == null || source.trim().isEmpty()) {
                return null;
            }
            // Cleanly strip leading/trailing whitespace, newlines (\n, \r, %0A), tabs, and trailing punctuation
            String clean = source.trim()
                    .replaceAll("[\\r\\n\\t]+", "")
                    .replaceAll("[:;,.]+$", "")
                    .trim();
            try {
                return UUID.fromString(clean);
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid UUID format: '" + source.trim() + "'");
            }
        }
    }
}
