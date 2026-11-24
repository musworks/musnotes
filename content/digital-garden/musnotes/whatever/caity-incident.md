---
title: "Caity: Black Screen, Failed POST, and Suspected RAM Failure"
date: 2026-11-24T00:00:00+07:00
draft: false
math: false
type: "garden-note"
summary: "A technical incident report documenting a black-screen failure, RAM diagnostics, and system recovery on a TECNO MEGABOOK K16S."
categories: ["computer"]
---

_Incident date: 2026/11/23 - 2026/11/24_


## 1. Device Specifications

- **Device:** TECNO MEGABOOK K16S (K16DA)
    
- **CPU:** AMD Ryzen 5 7430U
    
- **GPU:** Integrated AMD Radeon Graphics
    
- **RAM originally installed:** 16 GB (2 × 8 GB SO-DIMM)
    
- **Operating System:** Windows 11
    
- **Display:** 1920 × 1200
    
- **RAM configuration after incident:** 8 GB (1 × 8 GB)
    

The laptop is used daily for programming, CLI tools, AI agents, browsing, academic work, and gaming. It may remain powered on for an entire day.

## 2. Initial Symptoms

Before the major incident, the laptop experienced unusually loud fan noise.

During one session:

- CPU temperature fluctuated between approximately 70–90°C.
    
- Windows Update was consuming significant CPU resources.
    
- Windows Settings showed an update being installed.
    
- I also opened Optional Updates and noticed an audio driver update (exact driver name unknown).
    

While exploring the update interface and clicking a related help link, the display briefly froze and then became almost black/purple, with multicolored horizontal visual artifacts near the bottom of the screen.

## 3. Failed Boot Incident

After the display corruption:

1. I attempted to shut down the laptop by holding the power button, but it did not respond normally.
    
2. The fan became louder.
    
3. I opened the laptop's bottom cover and disconnected the internal battery connector.
    
4. After reconnecting the battery and attempting to power on, the laptop showed:
    
    - White power indicator.
        
    - Fan operation.
        
    - Fn indicator illumination.
        
    - Completely black display with no visible backlight.
        
    - No apparent Caps Lock indicator response.
        
5. The fan sometimes spun briefly, stopped, and then started spinning again.
    
6. Connecting the charger caused the charging indicator to illuminate orange.
    

The laptop showed no visible manufacturer logo or Windows boot screen.

At this point, I suspected possible BIOS/firmware corruption, GPU failure, RAM failure, or motherboard-related problems. None of these possibilities had been confirmed.

## 4. Technician Diagnosis

The laptop was eventually taken to a technician.

The technician tested both original RAM modules and both RAM slots.

Reported results:

- RAM Module A (8 GB): Works in both RAM slots.
    
- RAM Module B (8 GB): Causes the laptop to fail to power on properly, regardless of the tested slot.
    

The technician concluded that one RAM module was defective.

The laptop was returned with only the working 8 GB RAM module installed.

Important distinction: I was not told whether the technician used MemTest86, a dedicated RAM tester, or simply tested boot functionality. The exact nature of the RAM failure remains unknown.

The technician did not provide a detailed diagnosis of the SSD, motherboard, or BIOS/EC firmware.

## 5. Recovery and Windows Repair

After the RAM module was removed:

- The laptop successfully powered on.
    
- Windows booted again.
    
- The system felt responsive and smooth.
    
- My academic files and practical report remained accessible.
    

However, Windows Update was still processing an item labeled:

**Windows 11, version 26H2 (repair version)**

The installation initially showed 45%, later 75%, and eventually completed after restarting.

After the restart, the laptop returned to normal operation.

There is no confirmed evidence that the original incident was caused by Windows Update, BIOS corruption, or GPU failure.

## 6. Current System Condition

The laptop currently operates with:

- 8 GB RAM instead of the original 16 GB.
    
- One working RAM module.
    
- Both RAM slots previously tested successfully with the working module.
    
- Windows 11 repair installation completed.
    
- Personal files and academic documents intact.
    

The system feels smooth during ordinary workloads, including:

- Zettlr.
    
- Microsoft Edge.
    
- WhatsApp.
    
- File Explorer.
    
- CLI applications.
    
- AI agent workflows.

## 7. Diagnostic Limitations

The available findings do not establish the precise failure mechanism of the defective RAM module.

No post-recovery comprehensive memory test, extended stability test, or thermal stress test has been performed.

The current assessment is therefore based on the technician's reported cross-testing results and subsequent normal system operation.
    

## 8. Memory Usage Observations

After recovery, Task Manager showed relatively high RAM utilization.

Observed values:

|Metric|Observation|
|---|---|
|Installed RAM|8 GB|
|Usable RAM|7.4 GB|
|Hardware reserved|612 MB|
|In use|Approximately 6.0 GB|
|Available|1.4 GB|
|Cached|1.4 GB|
|Compressed|564 MB|
|Committed|9.9 / 15.4 GB|
|Memory usage|Approximately 81%|

Later, after closing applications except the browser and Task Manager, RAM usage was still approximately 72% (5.2 GB).

Despite this, the laptop remained smooth and responsive.

Microsoft Edge's resource controls were configured with a 1 GB limit. Startup applications and other basic optimization steps were also reviewed.

The memory usage fluctuated between approximately 70–80%.

There is currently no confirmed evidence of a memory leak or abnormal Windows memory consumption.

## 10. Temperature Observations

Before the incident, CPU temperature was observed at approximately 70–90°C during the Windows Update-related incident.

I did not routinely monitor temperatures during normal workloads such as browsing, gaming, coding, or academic work.

The earlier fan noise may be relevant, but there is insufficient temperature history to determine whether the cooling system contributed to the incident.

No stress testing has been performed after recovery.

## 11. Outstanding Questions for Further Investigation

I would like an independent technical assessment of the following:

1. What are the plausible causes of a single DDR4 SO-DIMM module failing while the other module and both RAM slots work?
    
2. Can ordinary prolonged daily laptop usage realistically cause this type of RAM failure?
    
3. Could the initial black-screen incident and RAM failure be causally related, or were they potentially separate problems?
    
4. Is there any reason to investigate BIOS/UEFI, EC firmware, motherboard power delivery, or integrated graphics after this recovery?
    
5. Is the current 70–80% RAM utilization normal for Windows 11 on an 8 GB system?
    
6. What diagnostic steps should be performed before purchasing a replacement RAM module?
    
7. What temperature monitoring and cooling-system checks should be performed?
    

## 12. Important Diagnostic Constraints

Please distinguish clearly between:

- Directly observed symptoms.
    
- Technician-confirmed findings.
    
- Plausible hypotheses.
    
- Unverified assumptions.
    

Avoid concluding that BIOS corruption, GPU failure, motherboard failure, or Windows Update caused the original incident without supporting evidence.

The primary goal is to understand the RAM failure, ensure system stability, and avoid unnecessary repairs or purchases.

**Current status: Laptop operational, one defective RAM module suspected/identified by technician, 8 GB installed, personal data intact.**