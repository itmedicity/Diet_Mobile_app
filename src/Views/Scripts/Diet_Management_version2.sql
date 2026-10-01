-- DIET MAIN WORKFLOW WITHOUT MASTER DETAILS



-- Initial Stage of  the Diet Planning
-- 1.
CREATE TABLE `patient_diet_plan` (
  `plan_id` bigint NOT NULL AUTO_INCREMENT,
  `patient_id` char(10) NOT NULL COMMENT 'Patient ID',
  `admission_id` varchar(45) NOT NULL COMMENT 'Admission ID',
  `diet_id` bigint NOT NULL COMMENT 'Diet ID',
  `doctor_id` char(4) NOT NULL,
  `dietitian_id` int DEFAULT NULL COMMENT 'Dietitian ID',
  `remarks` text,
  `diet_status` enum('ACTIVE','STOPPED','CHANGED') DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_by` int NOT NULL COMMENT 'Employee ID',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL COMMENT 'Employee ID',
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `is_consultation` int DEFAULT '0',
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  PRIMARY KEY (`plan_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  KEY `patient_diet_plan_ibfk_3_idx` (`diet_id`),
  CONSTRAINT `patient_diet_plan_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `co_employee_master` (`em_id`),
  CONSTRAINT `patient_diet_plan_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `co_employee_master` (`em_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 2.

CREATE TABLE `patient_diet_schedule` (
  `patient_diet_id` bigint NOT NULL AUTO_INCREMENT,
  `plan_id` bigint NOT NULL,
  `process_date` datetime NOT NULL,
  `type_id` int NOT NULL,
  `status` enum('PENDING','SERVED','CANCELLED') NOT NULL DEFAULT 'PENDING' COMMENT 'PENDING, SERVED, CANCELLED',
  `is_active` tinyint(1) DEFAULT '1',
  `remarks` varchar(255) DEFAULT NULL,
  `cancel_reason` varchar(255) DEFAULT NULL,
  `cancelled_by` int DEFAULT NULL,
  `cancelled_at` datetime DEFAULT NULL,
  `created_by` int NOT NULL COMMENT 'Employee ID',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL COMMENT 'Employee ID',
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`patient_diet_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  KEY `cancelled_by` (`cancelled_by`),
  KEY `type_id` (`type_id`),
  KEY `patient_diet_schedule_ibfk_5` (`plan_id`),
  CONSTRAINT `patient_diet_schedule_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `co_employee_master` (`em_id`),
  CONSTRAINT `patient_diet_schedule_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `co_employee_master` (`em_id`),
  CONSTRAINT `patient_diet_schedule_ibfk_3` FOREIGN KEY (`cancelled_by`) REFERENCES `co_employee_master` (`em_id`),
  CONSTRAINT `patient_diet_schedule_ibfk_4` FOREIGN KEY (`type_id`) REFERENCES `diet_type` (`type_slno`),
  CONSTRAINT `patient_diet_schedule_ibfk_5` FOREIGN KEY (`plan_id`) REFERENCES `patient_diet_plan` (`plan_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Daily diet Patient Schedule Type - Breakfast, Lunch, Dinner';


-- Once Planned Now Taking Corresponding Orders of Patients and Bystanders
-- 1.Diet Orders
-- 2.Canteen Orders
-- 3.Patient Extra Order 


-- 3.
CREATE TABLE `canteen_order` (
  `canteen_order_id` bigint NOT NULL AUTO_INCREMENT,
  `admission_id` varchar(10) DEFAULT NULL,
  `party_type_id` int NOT NULL COMMENT 'Patient, Bystander',
  `nursing_station_id` int NOT NULL COMMENT 'Nursing Station ID',
  `room_id` int NOT NULL COMMENT 'Room ID',
  `order_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `order_status` enum('PENDING','CONFIRMED','CANCELLED') DEFAULT 'PENDING',
  `created_by` int NOT NULL COMMENT 'Employee ID',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL COMMENT 'Employee ID',
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`canteen_order_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  KEY `nursing_station_id` (`nursing_station_id`),
  KEY `room_id` (`room_id`),
  KEY `party_type_id` (`party_type_id`),
  CONSTRAINT `canteen_order_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `co_employee_master` (`em_id`),
  CONSTRAINT `canteen_order_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `co_employee_master` (`em_id`),
  CONSTRAINT `canteen_order_ibfk_3` FOREIGN KEY (`nursing_station_id`) REFERENCES `fb_nurse_station_master` (`fb_nurse_stn_slno`),
  CONSTRAINT `canteen_order_ibfk_4` FOREIGN KEY (`room_id`) REFERENCES `fb_bed` (`fb_bed_slno`),
  CONSTRAINT `canteen_order_ibfk_5` FOREIGN KEY (`party_type_id`) REFERENCES `order_party_type` (`party_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- 4

CREATE TABLE `canteen_order_item` (
  `canteen_order_item_id` bigint NOT NULL AUTO_INCREMENT,
  `canteen_order_id` bigint DEFAULT NULL,
  `item_id` bigint DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `gst` decimal(10,2) DEFAULT '0.00' COMMENT 'GST rate - 18%',
  `gst_amount` decimal(10,2) DEFAULT '0.00' COMMENT 'GST amount',
  `is_active` int DEFAULT '1',
  `type_slno` int DEFAULT NULL,
  `patient_diet_id` bigint DEFAULT NULL,
  PRIMARY KEY (`canteen_order_item_id`),
  KEY `canteen_order_id` (`canteen_order_id`),
  KEY `item_id` (`item_id`),
  KEY `fk_canteen_item_schedule` (`patient_diet_id`),
  CONSTRAINT `canteen_order_item_ibfk_1` FOREIGN KEY (`canteen_order_id`) REFERENCES `canteen_order` (`canteen_order_id`),
  CONSTRAINT `canteen_order_item_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `item_master` (`item_id`),
  CONSTRAINT `fk_canteen_item_schedule` FOREIGN KEY (`patient_diet_id`) REFERENCES `patient_diet_schedule` (`patient_diet_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- 5
CREATE TABLE `diet_order` (
  `order_id` bigint NOT NULL AUTO_INCREMENT,
  `patient_id` int DEFAULT NULL,
  `plan_id` bigint NOT NULL,
  `order_date` date DEFAULT NULL COMMENT 'Date food will be served',
  `nursing_station_id` int NOT NULL COMMENT 'Nursing Station ID',
  `room_id` int NOT NULL COMMENT 'Room ID',
  `order_status` enum('PENDING','CONFIRMED','CANCELLED') DEFAULT 'PENDING',
  `collected_by` int NOT NULL COMMENT 'Employee ID',
  `collected_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL COMMENT 'Employee ID',
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_id`),
  KEY `collected_by` (`collected_by`),
  KEY `updated_by` (`updated_by`),
  KEY `nursing_station_id` (`nursing_station_id`),
  KEY `room_id` (`room_id`),
  KEY `patient_id` (`patient_id`),
  KEY `diet_order_ibfk_6` (`plan_id`),
  CONSTRAINT `diet_order_ibfk_1` FOREIGN KEY (`collected_by`) REFERENCES `co_employee_master` (`em_id`),
  CONSTRAINT `diet_order_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `co_employee_master` (`em_id`),
  CONSTRAINT `diet_order_ibfk_3` FOREIGN KEY (`nursing_station_id`) REFERENCES `fb_nurse_station_master` (`fb_nurse_stn_slno`),
  CONSTRAINT `diet_order_ibfk_4` FOREIGN KEY (`room_id`) REFERENCES `fb_bed` (`fb_bed_slno`),
  CONSTRAINT `diet_order_ibfk_5` FOREIGN KEY (`patient_id`) REFERENCES `fb_ipadmiss` (`fb_ipad_slno`),
  CONSTRAINT `diet_order_ibfk_6` FOREIGN KEY (`plan_id`) REFERENCES `patient_diet_plan` (`plan_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 6

CREATE TABLE `diet_order_detail` (
  `order_detail_id` bigint NOT NULL AUTO_INCREMENT,
  `order_id` bigint DEFAULT NULL,
  `patient_diet_id` bigint DEFAULT NULL,
  `diet_type_id` int NOT NULL COMMENT 'Breakfast, Lunch, Dinner',
  `item_id` bigint DEFAULT NULL,
  `is_substitute` tinyint(1) DEFAULT '0',
  `quantity` decimal(10,2) DEFAULT '1.00',
  `unit_id` int NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`order_detail_id`),
  KEY `order_id` (`order_id`),
  KEY `diet_type_id` (`diet_type_id`),
  KEY `item_id` (`item_id`),
  KEY `unit_id` (`unit_id`),
  KEY `fk_diet_order_detail_schedule` (`patient_diet_id`),
  CONSTRAINT `diet_order_detail_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `diet_order` (`order_id`),
  CONSTRAINT `diet_order_detail_ibfk_2` FOREIGN KEY (`diet_type_id`) REFERENCES `diet_type` (`type_slno`),
  CONSTRAINT `diet_order_detail_ibfk_3` FOREIGN KEY (`item_id`) REFERENCES `item_master` (`item_id`),
  CONSTRAINT `diet_order_detail_ibfk_4` FOREIGN KEY (`unit_id`) REFERENCES `unit_master` (`unit_id`),
  CONSTRAINT `fk_diet_order_detail_schedule` FOREIGN KEY (`patient_diet_id`) REFERENCES `patient_diet_schedule` (`patient_diet_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- 7
CREATE TABLE `patient_extra_order` (
  `extra_order_id` bigint NOT NULL AUTO_INCREMENT,
  `patient_id` int DEFAULT NULL,
  `item_id` bigint DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  `order_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `order_status` enum('PENDING','CONFIRMED','CANCELLED') DEFAULT 'PENDING',
  `price` decimal(10,2) DEFAULT NULL,
  `gst` decimal(10,2) DEFAULT NULL,
  `gst_amount` decimal(10,2) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_by` int NOT NULL COMMENT 'Employee ID',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL COMMENT 'Employee ID',
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`extra_order_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  KEY `patient_id` (`patient_id`),
  KEY `item_id` (`item_id`),
  CONSTRAINT `patient_extra_order_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `co_employee_master` (`em_id`),
  CONSTRAINT `patient_extra_order_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `co_employee_master` (`em_id`),
  CONSTRAINT `patient_extra_order_ibfk_3` FOREIGN KEY (`patient_id`) REFERENCES `fb_ipadmiss` (`fb_ipad_slno`),
  CONSTRAINT `patient_extra_order_ibfk_4` FOREIGN KEY (`item_id`) REFERENCES `item_master` (`item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- From this part the Order item Goes for the Kitchen 
-- 1.batch creation
-- 2.batch mapping => which order maps to the Corresponding Batches
-- 3.kitchen status updation for the next delivery process
-- 8
CREATE TABLE `diet_production_batch` (
  `batch_id` bigint NOT NULL AUTO_INCREMENT,
  `production_date` datetime NOT NULL,
  `type_id` int NOT NULL COMMENT 'Breakfast, Lunch, Dinner',
  `is_active` tinyint(1) DEFAULT '1',
  `remarks` varchar(255) DEFAULT NULL,
  `processed_by` int DEFAULT NULL,
  `processed_at` datetime DEFAULT NULL,
  `cancelled_by` int DEFAULT NULL,
  `cancelled_at` datetime DEFAULT NULL,
  `kitchen_status` varchar(20) DEFAULT 'PENDING',
  PRIMARY KEY (`batch_id`),
  KEY `processed_by` (`processed_by`),
  KEY `cancelled_by` (`cancelled_by`),
  KEY `type_id` (`type_id`),
  CONSTRAINT `diet_production_batch_ibfk_1` FOREIGN KEY (`processed_by`) REFERENCES `co_employee_master` (`em_id`),
  CONSTRAINT `diet_production_batch_ibfk_2` FOREIGN KEY (`cancelled_by`) REFERENCES `co_employee_master` (`em_id`),
  CONSTRAINT `diet_production_batch_ibfk_3` FOREIGN KEY (`type_id`) REFERENCES `diet_type` (`type_slno`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


--9

CREATE TABLE `diet_production_items` (
  `production_item_id` bigint NOT NULL AUTO_INCREMENT,
  `batch_id` bigint NOT NULL COMMENT 'Diet production batch',
  `item_id` bigint NOT NULL COMMENT 'Food item',
  `required_qty` decimal(10,2) NOT NULL,
  `unit_id` int DEFAULT NULL COMMENT 'Unit',
  `kitchen_status` varchar(20) DEFAULT 'PENDING',
  `prepared_by` bigint DEFAULT NULL,
  `prepared_at` datetime DEFAULT NULL,
  PRIMARY KEY (`production_item_id`),
  KEY `batch_id` (`batch_id`),
  CONSTRAINT `diet_production_items_ibfk_1` FOREIGN KEY (`batch_id`) REFERENCES `diet_production_batch` (`batch_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 10

CREATE TABLE `diet_production_order_map` (
  `map_id` bigint NOT NULL AUTO_INCREMENT,
  `batch_id` bigint NOT NULL,
  `canteen_order_id` bigint NOT NULL,
  `mapped_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`map_id`),
  KEY `batch_id` (`batch_id`),
  KEY `canteen_order_id` (`canteen_order_id`),
  CONSTRAINT `diet_production_order_map_ibfk_1` FOREIGN KEY (`batch_id`) REFERENCES `diet_production_batch` (`batch_id`),
  CONSTRAINT `diet_production_order_map_ibfk_2` FOREIGN KEY (`canteen_order_id`) REFERENCES `canteen_order` (`canteen_order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- From here on The Delivery Process starts
-- 1. Assigning Order to the Staffs
-- 2. Staffs pickuping and Delivery Marking Details

-- 11
CREATE TABLE `diet_delivery_assignment` (
  `assignment_id` bigint NOT NULL AUTO_INCREMENT,
  `assigned_to` int NOT NULL COMMENT 'Delivery Staff Employee ID',
  `assigned_by` int NOT NULL COMMENT 'Supervisor / Kitchen staff',
  `assigned_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `pickup_time` datetime DEFAULT NULL,
  `completed_time` datetime DEFAULT NULL,
  `delivery_status` enum('ASSIGNED','PICKEDUP','INPROGRESS','COMPLETED','PARTIAL','CANCELLED') DEFAULT 'ASSIGNED',
  `remarks` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`assignment_id`),
  KEY `assigned_to` (`assigned_to`),
  KEY `assigned_by` (`assigned_by`),
  CONSTRAINT `diet_delivery_assignment_ibfk_2` FOREIGN KEY (`assigned_to`) REFERENCES `co_employee_master` (`em_id`),
  CONSTRAINT `diet_delivery_assignment_ibfk_3` FOREIGN KEY (`assigned_by`) REFERENCES `co_employee_master` (`em_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- 12

CREATE TABLE `diet_delivery_assignment_detail` (
  `assignment_detail_id` bigint NOT NULL AUTO_INCREMENT,
  `assignment_id` bigint NOT NULL,
  `canteen_order_id` bigint NOT NULL,
  `type_slno` int DEFAULT NULL,
  `delivery_priority` enum('NORMAL','URGENT','STAT') DEFAULT 'NORMAL',
  `delivery_status` enum('PENDING','PICKEDUP','DELIVERED','UNDELIVERED','RETURNED','PARTIAL','CANCELLED') DEFAULT 'PENDING',
  `delivered_at` datetime DEFAULT NULL,
  `delivered_by` int DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`assignment_detail_id`),
  KEY `assignment_id` (`assignment_id`),
  KEY `canteen_order_id` (`canteen_order_id`),
  KEY `delivered_by` (`delivered_by`),
  CONSTRAINT `diet_delivery_assignment_detail_ibfk_1` FOREIGN KEY (`assignment_id`) REFERENCES `diet_delivery_assignment` (`assignment_id`),
  CONSTRAINT `diet_delivery_assignment_detail_ibfk_2` FOREIGN KEY (`canteen_order_id`) REFERENCES `canteen_order` (`canteen_order_id`),
  CONSTRAINT `diet_delivery_assignment_detail_ibfk_3` FOREIGN KEY (`delivered_by`) REFERENCES `co_employee_master` (`em_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- 13
CREATE TABLE `diet_delivery_log` (
  `delivery_id` bigint NOT NULL AUTO_INCREMENT,
  `patient_diet_id` bigint DEFAULT NULL,
  `item_id` bigint DEFAULT NULL,
  `delivered_qty` decimal(10,2) DEFAULT NULL,
  `delivery_status` enum('PENDING','PREPARED','DELIVERED','SKIPPED','CANCELLED','PICKEDUP','RETURNED','UNDELIVERED') NOT NULL DEFAULT 'PENDING' COMMENT 'PENDING, PREPARED, DELIVERED, SKIPPED, CANCELLED, PICKEDUP, RETURNED, UNDELIVERED',
  `develivered_by` int DEFAULT NULL,
  `delivered_time` datetime DEFAULT NULL,
  `delivery_remarks` varchar(255) DEFAULT NULL,
  `updated_by` int DEFAULT NULL COMMENT 'Employee ID',
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_remarks` varchar(255) DEFAULT NULL,
  `canteen_order_id` bigint DEFAULT NULL,
  `type_slno` int DEFAULT NULL,
  `source_type` enum('DIET_ORDER','PATIENT_EXTRA_ORDER','CANTEEN_ORDER') NOT NULL,
  `source_id` bigint DEFAULT NULL,
  PRIMARY KEY (`delivery_id`),
  KEY `patient_diet_id` (`patient_diet_id`),
  KEY `item_id` (`item_id`),
  KEY `develivered_by` (`develivered_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `diet_delivery_log_ibfk_1` FOREIGN KEY (`patient_diet_id`) REFERENCES `patient_diet_schedule` (`patient_diet_id`),
  CONSTRAINT `diet_delivery_log_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `item_master` (`item_id`),
  CONSTRAINT `diet_delivery_log_ibfk_3` FOREIGN KEY (`develivered_by`) REFERENCES `co_employee_master` (`em_id`),
  CONSTRAINT `diet_delivery_log_ibfk_4` FOREIGN KEY (`updated_by`) REFERENCES `co_employee_master` (`em_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;




-- from Here Starts the Billing and Other Payment Details
-- 1. Commong Service Ledger
-- 2. Diet Meal charge
-- 3. Extra Order Details

-- 1. diet_service_ledger = Extra Food (Pay per Item)
-- What it tracks: Canteen food and extra snack orders.
-- When it records: Only when delivered.
-- Example: The patient orders an extra juice or a sandwich. Once it is handed to them, it gets logged here to be billed.

-- 14
CREATE TABLE `diet_service_ledger` (
  `ledger_id` bigint NOT NULL AUTO_INCREMENT,
  `admission_id` bigint NOT NULL,
  `pt_no` varchar(45) DEFAULT NULL,
  `party_type_id` int NOT NULL COMMENT 'PATIENT / BYSTANDER',
  `delivery_id` bigint DEFAULT NULL COMMENT 'References diet_delivery_log.delivery_id',
  `canteen_order_id` bigint DEFAULT NULL COMMENT 'References canteen_order_id',
  `item_id` bigint NOT NULL,
  `quantity` decimal(10,2) DEFAULT '1.00',
  `unit_rate` decimal(12,2) NOT NULL,
  `gross_amount` decimal(12,2) NOT NULL,
  `discount` decimal(12,2) DEFAULT '0.00',
  `gst_rate` decimal(5,2) DEFAULT '0.00',
  `gst_amount` decimal(12,2) DEFAULT '0.00',
  `net_amount` decimal(12,2) NOT NULL,
  `ledger_status` enum('PENDING','BILLED','CANCELLED') DEFAULT 'PENDING',
  `remarks` varchar(255) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ledger_id`),
  KEY `party_type_id` (`party_type_id`),
  KEY `item_id` (`item_id`),
  KEY `delivery_id` (`delivery_id`),
  KEY `canteen_order_id` (`canteen_order_id`),
  CONSTRAINT `diet_service_ledger_ibfk_1` FOREIGN KEY (`party_type_id`) REFERENCES `order_party_type` (`party_type_id`),
  CONSTRAINT `diet_service_ledger_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `item_master` (`item_id`),
  CONSTRAINT `diet_service_ledger_ibfk_3` FOREIGN KEY (`delivery_id`) REFERENCES `diet_delivery_log` (`delivery_id`),
  CONSTRAINT `diet_service_ledger_ibfk_4` FOREIGN KEY (`canteen_order_id`) REFERENCES `canteen_order` (`canteen_order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- 15

-- 2. diet_meal_charge = Daily Hospital Meals (Flat Rate)
-- What it tracks: The regular doctor-assigned hospital diet (Diabetic Lunch, Soft Food Breakfast, etc.).
-- When it records: Based on the patient's scheduled diet plan.
-- Example: The set fee for the patient's daily hospital meals, billed as a package deal rather than per item.

CREATE TABLE `diet_meal_charge` (
  `meal_charge_id` bigint NOT NULL AUTO_INCREMENT,
  `admission_id` bigint NOT NULL,
  `pt_no` varchar(45) DEFAULT NULL,
  `patient_diet_id` bigint NOT NULL,
  `diet_id` int NOT NULL,
  `party_type_id` int NOT NULL,
  `type_slno` int NOT NULL,
  `meal_rate` decimal(10,2) NOT NULL,
  `discount` decimal(10,2) DEFAULT '0.00',
  `net_amount` decimal(10,2) NOT NULL,
  `charge_status` enum('PENDING','BILLED','CANCELLED') DEFAULT 'PENDING',
  `remarks` varchar(255) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`meal_charge_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- 16

-- Final Bill Integration
-- When generating the final Patient Bill, the system combines both:
-- Total Food Bill = Hospital Diet Package(diet_meal_charge) + Extra Snacks Delivered(diet_service_ledger);

CREATE TABLE `patient_billing` (
  `billing_id` bigint NOT NULL AUTO_INCREMENT,
  `bill_no` varchar(30) DEFAULT NULL,
  `patient_id` varchar(20) NOT NULL,
  `admission_id` varchar(20) NOT NULL,
  `assignment_detail_id` bigint DEFAULT NULL,
  `billing_party_type` tinyint NOT NULL DEFAULT '1',
  `billing_date` date NOT NULL,
  `bill_type` enum('PRE_GENERATED','DELIVERY_GENERATED') NOT NULL DEFAULT 'DELIVERY_GENERATED',
  `bill_generated_by` int DEFAULT NULL,
  `bill_generated_location` enum('CANTEEN','DELIVERY') NOT NULL DEFAULT 'DELIVERY',
  `total_amount` decimal(12,2) DEFAULT '0.00',
  `paid_amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `balance_amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `billing_status` enum('OPEN','PARTIAL','PAID','CANCELLED') DEFAULT 'OPEN',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int NOT NULL COMMENT 'Employee ID',
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL COMMENT 'Employee ID',
  PRIMARY KEY (`billing_id`),
  UNIQUE KEY `bill_no` (`bill_no`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  KEY `fk_patient_billing_generated_by` (`bill_generated_by`),
  KEY `idx_assignment_detail_id` (`assignment_detail_id`),
  CONSTRAINT `fk_patient_billing_generated_by` FOREIGN KEY (`bill_generated_by`) REFERENCES `co_employee_master` (`em_id`),
  CONSTRAINT `patient_billing_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `co_employee_master` (`em_id`),
  CONSTRAINT `patient_billing_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `co_employee_master` (`em_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- 17

CREATE TABLE `patient_billing_detail` (
  `billing_detail_id` bigint NOT NULL AUTO_INCREMENT,
  `billing_id` bigint DEFAULT NULL,
  `category_id` int NOT NULL COMMENT 'DIET - 1, CANTEEN - 2, ROOM_SERVICE - 3',
  `party_type_id` int NOT NULL DEFAULT '1',
  `description` varchar(255) NOT NULL,
  `item_id` bigint DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  `rate` decimal(10,2) DEFAULT NULL,
  `gst` decimal(10,2) DEFAULT '0.00' COMMENT 'GST rate - 18%',
  `gst_amount` decimal(10,2) DEFAULT '0.00' COMMENT 'GST amount',
  `discount` decimal(10,2) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT 'Total amount',
  `reference_table` varchar(50) DEFAULT NULL COMMENT 'DIET - patient_diet, CANTEEN - canteen_order, ROOM_SERVICE - room_service_order',
  `reference_id` bigint DEFAULT NULL COMMENT 'DIET - patient_diet_id, CANTEEN - canteen_order_id, ROOM_SERVICE - room_service_order_id',
  `service_date` datetime DEFAULT NULL,
  `bill_item_status` enum('OPEN','PAID','CANCELLED') NOT NULL DEFAULT 'OPEN',
  PRIMARY KEY (`billing_detail_id`),
  KEY `billing_id` (`billing_id`),
  KEY `category_id` (`category_id`),
  KEY `item_id` (`item_id`),
  CONSTRAINT `patient_billing_detail_ibfk_1` FOREIGN KEY (`billing_id`) REFERENCES `patient_billing` (`billing_id`),
  CONSTRAINT `patient_billing_detail_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `billing_category_master` (`category_id`),
  CONSTRAINT `patient_billing_detail_ibfk_3` FOREIGN KEY (`item_id`) REFERENCES `item_master` (`item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- 18

CREATE TABLE `patient_bill_payment` (
  `payment_id` bigint NOT NULL AUTO_INCREMENT,
  `billing_id` bigint NOT NULL,
  `payment_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `amount` decimal(12,2) NOT NULL,
  `payment_mode` enum('CASH','CARD','UPI','BANK_TRANSFER','CREDIT') NOT NULL,
  `collected_by` int NOT NULL,
  `collected_location` enum('CANTEEN','DELIVERY') NOT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `payment_status` enum('SUCCESS','FAILED','REFUNDED') NOT NULL DEFAULT 'SUCCESS',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`payment_id`),
  KEY `idx_billing_id` (`billing_id`),
  KEY `idx_collected_by` (`collected_by`),
  CONSTRAINT `fk_payment_billing` FOREIGN KEY (`billing_id`) REFERENCES `patient_billing` (`billing_id`),
  CONSTRAINT `fk_payment_employee` FOREIGN KEY (`collected_by`) REFERENCES `co_employee_master` (`em_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- 19

CREATE TABLE `patient_bill_payment_detail` (
  `payment_detail_id` bigint NOT NULL AUTO_INCREMENT,
  `payment_id` bigint NOT NULL,
  `billing_detail_id` bigint NOT NULL,
  `paid_amount` decimal(12,2) NOT NULL,
  PRIMARY KEY (`payment_detail_id`),
  KEY `idx_payment_id` (`payment_id`),
  KEY `idx_billing_detail` (`billing_detail_id`),
  CONSTRAINT `fk_payment_detail_bill` FOREIGN KEY (`billing_detail_id`) REFERENCES `patient_billing_detail` (`billing_detail_id`),
  CONSTRAINT `fk_payment_detail_payment` FOREIGN KEY (`payment_id`) REFERENCES `patient_bill_payment` (`payment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



-- 20

CREATE TABLE `patient_bill_refund` (
  `refund_id` bigint NOT NULL AUTO_INCREMENT,
  `payment_id` bigint NOT NULL,
  `refund_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `refund_amount` decimal(12,2) NOT NULL,
  `refund_mode` enum('CASH','CARD','UPI','BANK_TRANSFER') NOT NULL,
  `refunded_by` int NOT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`refund_id`),
  KEY `idx_payment` (`payment_id`),
  KEY `fk_refund_employee` (`refunded_by`),
  CONSTRAINT `fk_refund_employee` FOREIGN KEY (`refunded_by`) REFERENCES `co_employee_master` (`em_id`),
  CONSTRAINT `fk_refund_payment` FOREIGN KEY (`payment_id`) REFERENCES `patient_bill_payment` (`payment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- 21

CREATE TABLE `patient_bill_refund_detail` (
  `refund_detail_id` bigint NOT NULL AUTO_INCREMENT,
  `refund_id` bigint NOT NULL,
  `payment_detail_id` bigint NOT NULL,
  `refund_amount` decimal(12,2) NOT NULL,
  `refunded_qty` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`refund_detail_id`),
  KEY `idx_refund` (`refund_id`),
  KEY `idx_payment_detail` (`payment_detail_id`),
  CONSTRAINT `fk_refunddetail_payment` FOREIGN KEY (`payment_detail_id`) REFERENCES `patient_bill_payment_detail` (`payment_detail_id`),
  CONSTRAINT `fk_refunddetail_refund` FOREIGN KEY (`refund_id`) REFERENCES `patient_bill_refund` (`refund_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;