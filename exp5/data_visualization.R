
# Load necessary libraries
install.packages("ggplot2")
install.packages("plotly")
install.packages("wordcloud")
install.packages("RColorBrewer")
install.packages("scatterplot3d")
install.packages("dplyr")

library(ggplot2)
library(plotly)
library(wordcloud)
library(RColorBrewer)
library(scatterplot3d)
library(dplyr)

getwd()

setwd("C:\\Users\\Admin\\Desktop\\SPIT\\Sem 7\\ADV\\Exp5")
getwd()

# Load the dataset
housing_data <- read.csv("housing_data.csv")

# Preview the data
head(housing_data)

#Word Chart

# Word chart for furnishingstatus
word_freq <- table(housing_data$furnishingstatus)

# Generate word cloud
wordcloud(words = names(word_freq), 
          freq = word_freq, 
          min.freq = 1, 
          max.words = 100, 
          colors = brewer.pal(8, "Dark2"))



# Box and Whisker plot for price vs bedrooms
ggplot(housing_data, aes(x = factor(bedrooms), y = price)) +
  geom_boxplot(fill = "lightblue", color = "darkblue") +
  labs(title = "Boxplot of Price by Bedrooms", 
       x = "Number of Bedrooms", y = "Price") +
  theme_minimal()

# Violin plot for price vs stories
ggplot(housing_data, aes(x = factor(stories), y = price)) +
  geom_violin(fill = "lightgreen") +
  labs(title = "Violin Plot of Price by Stories", 
       x = "Number of Stories", y = "Price") +
  theme_minimal()

# Linear regression plot
ggplot(housing_data, aes(x = area, y = price)) +
  geom_point(color = "blue") +
  geom_smooth(method = "lm", color = "red", se = FALSE) +
  labs(title = "Linear Regression: Price vs Area", x = "Area", y = "Price")

# Nonlinear regression plot
ggplot(housing_data, aes(x = area, y = price)) +
  geom_point(color = "blue") +
  geom_smooth(method = "loess", color = "green", se = FALSE) +
  labs(title = "Nonlinear Regression: Price vs Area", x = "Area", y = "Price")

# 3D scatter plot of price, area, and bedrooms
scatterplot3d(housing_data$area, housing_data$bedrooms, housing_data$price,
              pch = 16, highlight.3d = TRUE, 
              type = "h", color = "blue",
              xlab = "Area", ylab = "Bedrooms", zlab = "Price",
              main = "3D Scatterplot of Price, Area, and Bedrooms")

# Jitter plot for parking vs price
ggplot(housing_data, aes(x = factor(parking), y = price)) +
  geom_jitter(color = "purple", width = 0.2, height = 0) +
  labs(title = "Jitter Plot: Price by Parking Spaces", 
       x = "Parking Spaces", y = "Price") +
  theme_minimal()




