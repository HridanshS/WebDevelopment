library(dplyr)
library(tidyr)

setwd("/Users/Hridanshsaraogi/Desktop/Emory/Fall 2023/CS 441/Coding/WebDevelopment/M4 Static Viz/data")

# Read the input file
data <- read.csv("Hridansh_modified_global air pollution dataset.csv")
continents <- read.csv("Countries-Continents.csv")


###################################
##
## Code for 1st graph's data
## Graph 1: Various AQI Values by No. of Occurrences of Country in Dataset
###################################

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

#data_pivoted$Country[is.na(data_pivoted$Continent)]

data_pivoted$Continent <- continents$Continent[match(data_pivoted$Country, continents$Country)]
data_pivoted$Continent[which(data_pivoted$Country == "Viet Nam")] <- continents$Continent[match("Vietnam", continents$Country)]
data_pivoted$Continent[which(data_pivoted$Country == "Aruba")] <- "South America"
data_pivoted$Continent[which(data_pivoted$Country == "Bolivia (Plurinational State of)")] <- continents$Continent[match("Bolivia", continents$Country)]
data_pivoted$Continent[which(data_pivoted$Country == "Burkina Faso")] <- continents$Continent[match("Burkina", continents$Country)]
data_pivoted$Continent[which(data_pivoted$Country == "Cabo Verde")] <- continents$Continent[match("Cape Verde", continents$Country)]
data_pivoted$Continent[which(data_pivoted$Country == "Czechia")] <- continents$Continent[match("CZ", continents$Country)]
data_pivoted$Continent[which(data_pivoted$Country == "Côte d'Ivoire")] <- continents$Continent[match("Ivory Coast", continents$Country)]
data_pivoted$Continent[which(data_pivoted$Country == "Democratic Republic of the Congo")] <- continents$Continent[match("Congo", continents$Country)]
data_pivoted$Continent[which(data_pivoted$Country == "Iran (Islamic Republic of)")] <- continents$Continent[match("Iran", continents$Country)]
data_pivoted$Continent[which(data_pivoted$Country == "Kingdom of Eswatini")] <- "Africa"
data_pivoted$Continent[which(data_pivoted$Country == "Lao People's Democratic Republic")] <- continents$Continent[match("Laos", continents$Country)]
data_pivoted$Continent[which(data_pivoted$Country == "Myanmar")] <- continents$Continent[match("Burma (Myanmar)", continents$Country)]
data_pivoted$Continent[which(data_pivoted$Country == "Republic of Korea")] <- continents$Continent[match("Korea, South", continents$Country)]
data_pivoted$Continent[which(data_pivoted$Country == "Republic of Moldova")] <- continents$Continent[match("Moldova", continents$Country)]
data_pivoted$Continent[which(data_pivoted$Country == "Republic of North Macedonia")] <- continents$Continent[match("Macedonia", continents$Country)]
data_pivoted$Continent[which(data_pivoted$Country == "State of Palestine")] <- "Asia"
data_pivoted$Continent[which(data_pivoted$Country == "Syrian Arab Republic")] <- continents$Continent[match("Syria", continents$Country)]
data_pivoted$Continent[which(data_pivoted$Country == "United Kingdom of Great Britain and Northern Ireland")] <- continents$Continent[match("United Kingdom", continents$Country)]
data_pivoted$Continent[which(data_pivoted$Country == "United Republic of Tanzania")] <- continents$Continent[match("Tanzania", continents$Country)]
data_pivoted$Continent[which(data_pivoted$Country == "United States of America")] <- continents$Continent[match("US", continents$Country)]
data_pivoted$Continent[which(data_pivoted$Country == "Venezuela (Bolivarian Republic of)")] <- continents$Continent[match("Venezuela", continents$Country)]


# Print the pivoted dataset
#print(data_pivoted)

# Export the pivoted dataset to a CSV file
write.csv(data_pivoted, file = "pivoted_air_pollution_data.csv", row.names = FALSE)


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

#Below 3 lines not needed - just ensures all procedures occured fine
data_graph2 <- data_graph2 %>%
  group_by(name, Value = value) %>%  # Group by variable and rounded value
  summarise(NumOccurrences = sum(NumOccurrences))  # Sum occurrences for rounded values

# Rename columns
colnames(data_graph2) <- c("Variable", "Value", "NumOccurrences")

#Quickly check that all Variables have the same NumOccurrences. If yes, the above code has been successful
# data_summary %>%
#   group_by(Variable) %>%
#   summarise(Sum_NumOccurrences = sum(NumOccurrences))

# Export the pivoted dataset to a CSV file
write.csv(data_graph2, file = "graph2_pivoted_air_pollution_data.csv", row.names = FALSE)
