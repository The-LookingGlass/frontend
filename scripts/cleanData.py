###############
# This script cleans the job details downloaded by the getJobDetails.py script
# It does the following:
# - Read the job details from disk to a pandas dataframe
# - Remove duplicate jobs. The job listings allow multiple counties to be associated with a job which results in identical listings.
# - Drop rows where there is a blank company name. We need to remove jobs with a blank company name as geocoding is not feasible
# - Combine the address and county to create a search string for the API. This string uses a + for example university+college+dublin+belfield
# - Call the API and get the longitude/latitude
#################




######## Import libraries
import json
import pandas as pd
import urllib.request
import urllib.parse

######## Script variables
api_endpoint = 'https://maps.googleapis.com/maps/api/geocode/json?address=' 	# The geocode API endpoint
api_keystring = '&key=AIzaSyCz6UpAb5gNS2MYUihPfKlrrUa_LnYdgB8' 				# The Google API key
job_details_file = '/home/nana/jobsie/job_details/details.txt'				# The file to read the downloaded job details from
coordinates_file = '/home/nana/jobsie/job_details/coordinates.txt'			# The file to save the downloaded coordinates in

####### The actual program

# Read the job details from file into a a pandas dataframe as JSON
with open(job_details_file, "r") as f_in:
    data = f_in.readlines()
	
df = pd.DataFrame()
for line in data:
    row = json.loads(line)
    df = df.append(row, ignore_index=True)

# Remove duplicate jobs. The job listings allow multiple counties to be associated with a job. This results in identical listings in some cases. 
# We can simply drop the duplicates based on the jobID 
df.drop_duplicates(subset='Id', inplace=True)
len(df)	

# Drop rows where there is a blank company name.
# Jobs.ie appears to allow job entries to be created without company name or address details. We need to remove jobs with a blank company name as geocoding is not feasible.
df.dropna(subset=['Company'], inplace=True)
len(df)


######## Add a new column with the string to be used in the Google search.:
#	- Concatenate the company name, county and country
#	- Replace spaces with "+"
#	- Encode special characters in the string (e.g. @ becomes %40)

name_string = "" 
api_search_string = [] # List to hold the search string


### Loop over the dataframe and create a search string to be passed to the API. The search string format we use is the address and county tokenised with "+" in place of spaces.
for row in df.itertuples():
    
  # First we get the county from the RegionNames column. This values are a dictionary containing a list. 
  # We want the PRIMARY county. We take this as the first county from the list   
    county = row.RegionNames['string'][0] 
    
  # Split the address into words and replace spaces with a "+" (as required by the Google Geocode API)
  # Encode special characters in the string (urllib.parse.quote)
    company_name_split = (row.Company).split()       
    for part in company_name_split:
        part = urllib.parse.quote(part)
        if name_string == "":
            name_string = part
        else: 
            name_string = name_string + "+" + part
    
  # Add the address,  county name and "Ireland"; then add the result to the list 
    name_string = name_string + "+" + county + "+" + "ireland"
    api_search_string.append(name_string)
    
    name_string = "" # Reset the string for the loop



### Update the new dataframe column with the values
df['api_search_string'] = api_search_string

### Add a new feature to contain the longitude/latitude
coordinates = []
api_search_string = ""

# Construct the API URL for each job and call the API
for row in df['api_search_string'][:400]: # Slice to only get the first 400 to preserve credits for the API
    api_search_string = row
    ws_url = (api_endpoint + api_search_string + api_keystring).replace(" ", "")
    print(ws_url)
    response = urllib.request.urlopen(ws_url)
    html = response.read().decode()

# The response format is json. Extract the longitude/latitude
    location_json = json.loads(html)
    if len(location_json['results']) > 0:
        coordinates.append(location_json['results'][0]['geometry']['location'])
    else:
        coordinates.append('BLANK')

# WE ARE NOT WRITING BACK TO THE DATAFRAME YET AS WE ONLY HAVE A DATA SLICE
# df['coordinates'] = coordinates
# FOR NOW, WE SAVE TO A FILE
with open(coordinates_file, "w") as f_out:
        f_out.writelines(coordinates)









