library(dplyr)
library(tidyr)

setwd("/Users/Hridanshsaraogi/Desktop/Emory/Fall 2023/CS 441/Coding/M4 Static Viz/data")

# Read the input file
data <- read.csv("Hridansh_modified_global air pollution dataset.csv")

# Pivot the dataset
data_pivoted <- data %>%
  group_by(Country) %>%
  summarise(
    Num_Occurrences = n(),
    AQI_Value = round(mean(AQI.Value), 2),
    CO_AQI_Value = round(mean(CO.AQI.Value), 2),
    Ozone_AQI_Value = round(mean(Ozone.AQI.Value), 2),
    NO2_AQI_Value = round(mean(NO2.AQI.Value), 2),
    PM2.5_AQI_Value = round(mean(PM2.5.AQI.Value), 2)
  )

# Print the pivoted dataset
#print(data_pivoted)

# Export the pivoted dataset to a CSV file
write.csv(data_pivoted, file = "pivoted_air_pollution_data.csv", row.names = FALSE)
