# import streamlit as st
# import pandas as pd

# def load_data():
#     # Load your dataset here
#     # Replace 'your_dataset.csv' with the actual filename
#     df = pd.read_csv("dark_patterns.csv")
#     return df

# def main():
#     st.title('Dark Pattern Detection Dashboard')

#     # Load the dataset
#     df = load_data()

#     # Add a search bar for searching based on attributes
#     search_term = st.text_input('Search by attributes')

#     # Filter the dataset based on the search term
#     if search_term:
#         df = df[df.astype(str).apply(lambda x: x.str.contains(search_term, case=False)).any(axis=1)]

#     # Add filter options for all attributes
#     pattern_categories = df['Pattern Category'].unique()
#     selected_category = st.selectbox('Filter by Pattern Category', ['All'] + list(pattern_categories))
    
#     websites = df['Website Page'].unique()
#     selected_website = st.selectbox('Filter by Website', ['All'] + list(websites))

#     # Apply filters to the dataset
#     if selected_category != 'All':
#         df = df[df['Pattern Category'] == selected_category]
#     if selected_website != 'All':
#         df = df[df['Website Page'] == selected_website]

#     # Display the filtered dataset
#     st.write('## Filtered Dark Pattern Detection Dataset')
#     st.write(df)

# if __name__ == '__main__':
#     main()


import streamlit as st
from streamlit_embedcode import get_embed_code

def load_data():
    # Load your dataset here
    # Replace 'your_dataset.csv' with the actual filename
    df = pd.read_csv("dark_patterns.csv")
    return df

def main():
    st.title('Dark Pattern Detection Dashboard')

    # Load the dataset
    df = load_data()

    # Add a search bar for searching based on attributes
    search_term = st.text_input('Search by attributes')

    # Filter the dataset based on the search term
    if search_term:
        df = df[df.astype(str).apply(lambda x: x.str.contains(search_term, case=False)).any(axis=1)]

    # Add filter options for all attributes
    pattern_categories = df['Pattern Category'].unique()
    selected_category = st.selectbox('Filter by Pattern Category', ['All'] + list(pattern_categories))
    
    websites = df['Website Page'].unique()
    selected_website = st.selectbox('Filter by Website', ['All'] + list(websites))

    # Apply filters to the dataset
    if selected_category != 'All':
        df = df[df['Pattern Category'] == selected_category]
    if selected_website != 'All':
        df = df[df['Website Page'] == selected_website]

    # Display the filtered dataset
    st.write('## Filtered Dark Pattern Detection Dataset')
    st.write(df)

if __name__ == '__main__':
    main()

# Convert the Streamlit app to HTML and CSS
html_code, css_code = get_embed_code(main)

# Save the HTML and CSS code to files
with open('dark_pattern_dashboard.html', 'w') as html_file:
    html_file.write(html_code)

with open('dark_pattern_dashboard.css', 'w') as css_file:
    css_file.write(css_code)
