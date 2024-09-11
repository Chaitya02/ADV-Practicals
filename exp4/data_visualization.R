# Load required libraries
library(ggplot2)
library(dplyr)
library(lubridate)
library(stringr)

# Load the dataset
crime_data <- read.csv("Crime_Data_from_2020_to_Present.csv")

# Convert DATE OCC to Date type
crime_data$DATE_OCC <- as.Date(crime_data$DATE_OCC, format = "%m/%d/%Y")

# 1. Bar Chart: Top 10 Crime Codes
crime_codes <- crime_data %>%
  count(Crm_Cd) %>%
  arrange(desc(n)) %>%
  top_n(10)

ggplot(crime_codes, aes(x = reorder(Crm_Cd, n), y = n)) +
  geom_bar(stat = "identity", fill = "steelblue") +
  coord_flip() +
  labs(title = "Top 10 Crime Codes", x = "Crime Code", y = "Count") +
  theme_minimal()

# 2. Pie Chart: Crime Distribution by AREA NAME
area_crimes <- crime_data %>%
  count(AREA_NAME) %>%
  arrange(desc(n)) %>%
  top_n(5)

area_crimes <- area_crimes %>%
  mutate(percentage = n / sum(n) * 100)

ggplot(area_crimes, aes(x = "", y = n, fill = AREA_NAME)) +
  geom_bar(stat = "identity", width = 1) +
  coord_polar("y", start = 0) +
  geom_text(aes(label = sprintf("%.1f%%", percentage)), 
            position = position_stack(vjust = 0.5)) +
  labs(title = "Crime Distribution by Top 5 Areas", fill = "Area Name") +
  theme_void()

# 3. Histogram: Victim Age Distribution
ggplot(crime_data, aes(x = Vict_Age)) +
  geom_histogram(binwidth = 5, fill = "lightgreen", color = "black") +
  labs(title = "Distribution of Victim Ages", x = "Age", y = "Count") +
  theme_minimal()

# 4. Time Line Chart: Crime Occurrences Over Time
crime_over_time <- crime_data %>%
  count(DATE_OCC)

# Calculate y-axis limits based on data
y_max <- max(crime_over_time$n)
y_min <- min(crime_over_time$n)
y_range <- y_max - y_min

ggplot(crime_over_time, aes(x = DATE_OCC, y = n)) +
  geom_line(color = "darkred") +
  geom_smooth(method = "loess", color = "blue", se = FALSE) +
  labs(title = "Crime Occurrences Over Time", x = "Date", y = "Number of Crimes") +
  theme_minimal() +
  scale_y_continuous(limits = c(y_min - 0.1 * y_range, y_max + 0.1 * y_range),
                     expand = c(0, 0)) +
  scale_x_date(date_breaks = "3 months", date_labels = "%Y-%m") +
  theme(axis.text.x = element_text(angle = 45, hjust = 1))

# 5. Scatter Plot: Relationship between Time of Day and Number of Crimes
crime_data$hour <- as.numeric(str_sub(crime_data$TIME_OCC, 1, 2)) %% 24

hourly_crimes <- crime_data %>%
  count(hour)

ggplot(hourly_crimes, aes(x = hour, y = n)) +
  geom_point(color = "purple") +
  geom_smooth(method = "loess", color = "blue", se = FALSE) +
  labs(title = "Crimes by Hour of Day", x = "Hour (24-hour format)", y = "Number of Crimes") +
  theme_minimal() +
  scale_x_continuous(breaks = seq(0, 23, by = 2)) +
  theme(axis.text.x = element_text(angle = 45, hjust = 1))

# 6. Bubble Plot: Crime Codes, Areas, and Frequencies
crime_bubble <- crime_data %>%
  count(Crm_Cd, AREA_NAME) %>%
  arrange(desc(n)) %>%
  top_n(20)

ggplot(crime_bubble, aes(x = Crm_Cd, y = AREA_NAME, size = n)) +
  geom_point(alpha = 0.7, color = "orange") +
  scale_size(range = c(3, 15)) +
  labs(title = "Crime Codes and Areas", x = "Crime Code", y = "Area Name", size = "Number of Crimes") +
  theme_minimal() +
  theme(axis.text.x = element_text(angle = 45, hjust = 1))
