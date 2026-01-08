**Overview**

This project implements a scalable, fault-tolerant web scraping system for Booking.com using AWS ECS, SQS (FIFO), Puppeteer, and Auto Scaling.

**It is designed to scrape:**

30 countries

Last 30 days of data

Runs every hour

Auto-scales ECS tasks dynamically

Avoids duplicate scraping

Handles anti-bot & proxy rotation

