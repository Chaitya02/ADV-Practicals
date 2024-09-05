import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.express as px
import plotly.graph_objs as go

# Load datasets
statewise_testing = pd.read_csv('StatewiseTestingDetails.csv')
covid19_india = pd.read_csv('covid_19_india.csv')

# Convert 'Date' to datetime using correct formats
statewise_testing['Date'] = pd.to_datetime(statewise_testing['Date'], format='%Y-%m-%d')
covid19_india['Date'] = pd.to_datetime(covid19_india['Date'], format='%d-%m-%Y')

# Fill NaN values with 0 for numerical columns
statewise_testing.fillna(0, inplace=True)
covid19_india.fillna(0, inplace=True)

# Sidebar filters
st.sidebar.title("Filters")
selected_state = st.sidebar.selectbox("Select State", covid19_india['State/UnionTerritory'].unique())
selected_date = st.sidebar.date_input("Select Date Range", value=[covid19_india['Date'].min().date(), covid19_india['Date'].max().date()])

# Convert selected_date to datetime64
selected_date = pd.to_datetime(selected_date)

# Filter data based on selections
filtered_testing = statewise_testing[(statewise_testing['Date'] >= selected_date[0]) & (statewise_testing['Date'] <= selected_date[1])]
filtered_covid = covid19_india[(covid19_india['Date'] >= selected_date[0]) & (covid19_india['Date'] <= selected_date[1]) & (covid19_india['State/UnionTerritory'] == selected_state)]

# Dashboard title
st.title("COVID-19 Interactive Dashboard")

# 1. Bar Chart - Total confirmed cases by state
st.subheader("Total Confirmed Cases by State")
total_confirmed_by_state = covid19_india.groupby('State/UnionTerritory')['Confirmed'].sum().sort_values(ascending=False)
st.bar_chart(total_confirmed_by_state)

# 2. Pie Chart - Indian vs Foreign Nationals
st.subheader("Proportion of Indian vs Foreign Nationals in Confirmed Cases")
if not filtered_covid.empty:
    indian_vs_foreign = filtered_covid[['ConfirmedIndianNational', 'ConfirmedForeignNational']].sum()
    fig1, ax1 = plt.subplots()
    ax1.pie(indian_vs_foreign, labels=['Indian National', 'Foreign National'], autopct='%1.1f%%', startangle=90)
    ax1.axis('equal')
    st.pyplot(fig1)
else:
    st.write("No data available for the selected state and date range.")

# 3. Histogram - Distribution of daily testing
st.subheader("Distribution of Daily Testing")
if not filtered_testing.empty:
    fig2, ax2 = plt.subplots()
    ax2.hist(filtered_testing['TotalSamples'], bins=20)
    ax2.set_xlabel('Total Samples Tested')
    ax2.set_ylabel('Frequency')
    st.pyplot(fig2)
else:
    st.write("No testing data available for the selected date range.")

# 4. Timeline Chart - Trend of confirmed cases over time
st.subheader("Trend of Confirmed Cases Over Time")
if not filtered_covid.empty:
    fig3 = px.line(filtered_covid, x='Date', y='Confirmed', title='Confirmed Cases Over Time')
    st.plotly_chart(fig3)
else:
    st.write("No data available for the selected state and date range.")

# 5. Scatter Plot - Daily confirmed cases vs total tests
st.subheader("Daily Confirmed Cases vs Total Tests")
if not filtered_testing.empty and not filtered_covid.empty:
    # Merge datasets on Date for proper alignment
    merged_data = pd.merge(filtered_covid, filtered_testing, on='Date', how='inner')
    fig4 = px.scatter(merged_data, x='TotalSamples', y='Confirmed', title='Confirmed Cases vs Total Tests')
    st.plotly_chart(fig4)
else:
    st.write("Not enough data for both testing and confirmed cases to display this chart.")

# 6. Bubble Plot - States with bubble size based on confirmed cases
st.subheader("States with Bubble Size Based on Confirmed Cases")
if not filtered_covid.empty:
    fig5 = px.scatter(filtered_covid, x='Confirmed', y='Deaths', size='Confirmed', color='State/UnionTerritory',
                      hover_name='State/UnionTerritory', log_x=True, size_max=60)
    st.plotly_chart(fig5)
else:
    st.write("No data available for bubble plot.")

# 7. Box and Whisker Plot - Distribution of confirmed cases by state
st.subheader("Distribution of Confirmed Cases by State")
if not filtered_covid.empty:
    # Filter top 10 states with highest confirmed cases
    top_states = filtered_covid.groupby('State/UnionTerritory')['Confirmed'].sum().nlargest(10).index
    filtered_covid_top = filtered_covid[filtered_covid['State/UnionTerritory'].isin(top_states)]

    fig6, ax6 = plt.subplots()
    sns.boxplot(x='State/UnionTerritory', y='Confirmed', data=filtered_covid_top, ax=ax6)
    ax6.set_xticklabels(ax6.get_xticklabels(), rotation=90)
    st.pyplot(fig6)
else:
    st.write("No data available for box plot.")

# 8. Violin Plot - Distribution of confirmed cases over time
st.subheader("Distribution of Confirmed Cases Over Time")

fig7, ax7 = plt.subplots()
sns.violinplot(x='Date', y='Confirmed', data=filtered_covid, ax=ax7)

ax7.set_xticklabels(ax7.get_xticklabels(), rotation=45, ha='right')

ax7.xaxis.set_major_locator(plt.MaxNLocator(10))

ax7.set_xlabel('Date')
ax7.set_ylabel('Confirmed Cases')
st.pyplot(fig7)

# 9. Linear & Nonlinear Regression - Tests vs Confirmed Cases
st.subheader("Linear & Nonlinear Regression - Tests vs Confirmed Cases")

merged_data = pd.merge(filtered_testing[['Date', 'TotalSamples']], 
                       filtered_covid[['Date', 'Confirmed']], 
                       on='Date', how='inner')

if not merged_data.empty:
    fig8, ax8 = plt.subplots()

    sns.regplot(x=merged_data['TotalSamples'], y=merged_data['Confirmed'], ax=ax8)

    ax8.set_xlabel('Total Samples Tested')
    ax8.set_ylabel('Confirmed Cases')
    ax8.set_title('Linear Regression: Tests vs Confirmed Cases')

    st.pyplot(fig8)
else:
    st.write("Not enough data to display the regression plot.")


# 10. 3D Chart - Confirmed, Cured, and Deaths
st.subheader("3D Scatter Plot of Confirmed, Cured, and Deaths")
if not filtered_covid.empty:
    fig9 = px.scatter_3d(filtered_covid, x='Confirmed', y='Cured', z='Deaths', color='State/UnionTerritory')
    st.plotly_chart(fig9)
else:
    st.write("No data available for 3D scatter plot.")

# 11. Jitter Plot - Daily cases in different states
st.subheader("Jitter Plot - Daily Cases in Different States")
if not filtered_covid.empty:
    fig10, ax10 = plt.subplots()
    sns.stripplot(x='State/UnionTerritory', y='Confirmed', data=filtered_covid, jitter=True, ax=ax10)
    ax10.set_xticklabels(ax10.get_xticklabels(), rotation=90)
    st.pyplot(fig10)
else:
    st.write("No data available for jitter plot.")

# 12. Line Chart - Cumulative confirmed cases over time
st.subheader("Cumulative Confirmed Cases Over Time")
if not filtered_covid.empty:
    fig11 = px.line(filtered_covid, x='Date', y='Confirmed', title='Cumulative Confirmed Cases')
    st.plotly_chart(fig11)
else:
    st.write("No data available for cumulative cases chart.")

# 13. Area Chart - Total tests over time
st.subheader("Total Tests Conducted Over Time")
if not filtered_testing.empty:
    fig12 = px.area(filtered_testing, x='Date', y='TotalSamples', title='Total Tests Conducted Over Time')
    st.plotly_chart(fig12)
else:
    st.write("No data available for area chart.")

# 14. Waterfall Chart - Contribution of states to the overall increase in cases
st.subheader("Contribution of States to Overall Increase in Cases")
if not filtered_covid.empty:
    statewise_increase = filtered_covid.groupby('State/UnionTerritory')['Confirmed'].sum().sort_values(ascending=False).reset_index()
    
    fig15 = go.Figure()
    fig15.add_trace(go.Waterfall(
        x=statewise_increase['State/UnionTerritory'],
        y=statewise_increase['Confirmed'],
        measure=["relative"] * len(statewise_increase),
        name="Cases Increase",
        text=statewise_increase['Confirmed'],
        textposition="outside",
    ))
    fig15.update_layout(title='Contribution of States to Overall Increase in Cases', xaxis_title='State', yaxis_title='Increase in Confirmed Cases')
    st.plotly_chart(fig15)
else:
    st.write("No data available for waterfall chart.")


# 15. Funnel Chart - Progression of cases from confirmed to cured to deaths
st.subheader("Progression of Cases from Confirmed to Cured to Deaths")
if not filtered_covid.empty:
    stages = {
        'Confirmed': filtered_covid['Confirmed'].sum(),
        'Cured': filtered_covid['Cured'].sum(),
        'Deaths': filtered_covid['Deaths'].sum()
    }
    
    stages_df = pd.DataFrame(list(stages.items()), columns=['Stage', 'Count'])
    
    fig18 = px.funnel(stages_df, x='Count', y='Stage', title='Progression of Cases from Confirmed to Cured to Deaths')
    st.plotly_chart(fig18)
else:
    st.write("No data available for funnel chart.")

# 16. Donut Chart - Share of different states in total confirmed cases
st.subheader("Share of Different States in Total Confirmed Cases")
if not covid19_india.empty:
    statewise_share = covid19_india.groupby('State/UnionTerritory')['Confirmed'].sum().reset_index()
    
    fig16 = px.pie(statewise_share, names='State/UnionTerritory', values='Confirmed', hole=0.3, title='Share of Different States in Total Confirmed Cases')
    st.plotly_chart(fig16)
else:
    st.write("No data available for donut chart.")

# 17. Treemap - Proportion of cases in different states
st.subheader("Proportion of Cases in Different States")

if not covid19_india.empty:
    if 'State/UnionTerritory' in covid19_india.columns and 'Confirmed' in covid19_india.columns:
        # Check if there are any NaN or zero values in 'Confirmed'
        covid19_india = covid19_india[covid19_india['Confirmed'] > 0]
        
        # Check if the filtered data is not empty
        if not covid19_india.empty:
            fig13 = px.treemap(covid19_india, path=['State/UnionTerritory'], values='Confirmed', title='Proportion of Cases by State')
            st.plotly_chart(fig13)
        else:
            st.write("No data available for treemap.")
    else:
        st.write("Required columns are missing in the dataset.")
else:
    st.write("Filtered data is empty.")

# Conclusion
st.markdown("This dashboard provides an interactive way to explore the spread and impact of COVID-19 across different states in India. Each visualization offers insights into how the pandemic unfolded and was managed over time.")

