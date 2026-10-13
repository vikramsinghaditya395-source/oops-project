package com.voltflow.electricity.controller;

import com.voltflow.electricity.dto.ApiResponse;
import com.voltflow.electricity.model.Tariff;
import com.voltflow.electricity.repository.TariffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tariffs")
public class TariffController {

    @Autowired
    private TariffRepository tariffRepository;

    @GetMapping
    public List<Tariff> getAllTariffs() {
        return tariffRepository.findAll();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTariff(@PathVariable Long id, @RequestBody Tariff updated) {
        return tariffRepository.findById(id).map(t -> {
            t.setRatePerUnit(updated.getRatePerUnit());
            t.setFixedMonthlyCharge(updated.getFixedMonthlyCharge());
            t.setSurchargePercent(updated.getSurchargePercent());
            Tariff saved = tariffRepository.save(t);
            return ResponseEntity.ok(new ApiResponse(true, "Tariff updated successfully", saved));
        }).orElse(ResponseEntity.notFound().build());
    }
}
