library(dplyr)
library(tidyr)

setwd("/Users/Hridanshsaraogi/Desktop/Emory/Fall 2023/CS 441/Coding/WebDevelopment/M4 Static Viz/data")

# Read the input file
data <- read.csv("Hridansh_modified_global air pollution dataset.csv")


###################################
##
## Code for 1st graph's data
## Graph 1: Various AQI Values by No. of Occurrences of Country in Dataset
###################################

# # Pivot the dataset
# data_pivoted <- data %>%
#   group_by(Country) %>%
#   summarise(
#     Num_Occurrences = n(),
#     AQI_Value = round(mean(AQI.Value), 2),
#     CO_AQI_Value = round(mean(CO.AQI.Value), 2),
#     Ozone_AQI_Value = round(mean(Ozone.AQI.Value), 2),
#     NO2_AQI_Value = round(mean(NO2.AQI.Value), 2),
#     PM2.5_AQI_Value = round(mean(PM2.5.AQI.Value), 2)
#   )
# 
# # Print the pivoted dataset
# #print(data_pivoted)
# 
# # Export the pivoted dataset to a CSV file
# write.csv(data_pivoted, file = "pivoted_air_pollution_data.csv", row.names = FALSE)


###################################
##
## Code for 2nd graph's data
## Graph 2: Aggregate Frequency of AQI Values in Cities
###################################

# Pivot the dataset
data_graph2 <- data %>%
  pivot_longer(cols = -c(Country, City, AQI.Category, CO.AQI.Category, Ozone.AQI.Category, NO2.AQI.Category, PM2.5.AQI.Category)) %>%  # Reshape data to long format
  mutate(value = round(value, 2)) %>%  # Round the values to 2 decimal places
  group_by(name, value) %>%  # Group by variable and value
  summarise(NumOccurrences = n())  # Count occurrences

data_graph2 <- data_graph2 %>%
  group_by(name, Value = value) %>%  # Group by variable and rounded value
  summarise(NumOccurrences = sum(NumOccurrences))  # Sum occurrences for rounded values

# Rename columns
colnames(data_graph2) <- c("Variable", "Value", "NumOccurrences")

# Export the pivoted dataset to a CSV file
write.csv(data_graph2, file = "graph2_pivoted_air_pollution_data.csv", row.names = FALSE)
