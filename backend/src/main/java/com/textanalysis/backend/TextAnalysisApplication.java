package com.textanalysis.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;

import opennlp.tools.sentdetect.SentenceDetector;
import opennlp.tools.sentdetect.SentenceDetectorME;
import opennlp.tools.sentdetect.SentenceModel;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

@SpringBootApplication
@RestController
@CrossOrigin(origins = "*")
public class TextAnalysisApplication {

    public static void main(String[] args) {
        SpringApplication.run(TextAnalysisApplication.class, args);
    }

    @PostMapping("/analyze")
    public Map<String, Object> analyzeText(@RequestBody Map<String, String> payload) {
        String text = payload.get("text");
        Map<String, Object> result = new HashMap<>();

        try (InputStream modelIn = getClass().getResourceAsStream("/models/en-sent.bin")) {
            SentenceModel model = new SentenceModel(modelIn);
            SentenceDetector sentenceDetector = new SentenceDetectorME(model);

            String[] sentences = sentenceDetector.sentDetect(text);
            
            result.put("sentenceCount", sentences.length);
            result.put("sentences", sentences);
            result.put("totalLength", text.length());
            result.put("wordCount", text.split("\\s+").length);
        } catch (IOException e) {
            result.put("error", "Text parsing error");
        }

        return result;
    }
}