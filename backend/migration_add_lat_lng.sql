-- Migration script to add latitude and longitude columns to events table
-- Run this if you already have an existing database

ALTER TABLE events 
ADD COLUMN latitude DECIMAL(10,8) AFTER location,
ADD COLUMN longitude DECIMAL(11,8) AFTER latitude;

