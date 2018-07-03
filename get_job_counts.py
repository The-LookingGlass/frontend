
# Libraries used by the script
import zeep
import json
import datetime

# Function to retrieve job listings from the jobs.ie web service

def get_job_list(wsdl, fromDate, toDate, regionID, CategoryIds):
    client = zeep.Client(wsdl=wsdl)
    fromDate = fromDate
    toDate = toDate

    #data = client.service.GetJobDisplay(jobId = '1711730')
    with client.settings(strict=False):
        #data = client.service.SearchJobs(excludeAgencies = 1, regionIds = regionID, jobType = 'Any', jobHours = 'Any', fromDate = fromDate, toDate = toDate, startRecord = 0, pageSize = 800)
        data = client.service.SearchJobs(excludeAgencies = 1, regionIds = regionID, jobCategoryIds = CategoryIds, jobType = 'Any', jobHours = 'Any', fromDate = fromDate, toDate = toDate, startRecord = 0, pageSize = 800)
    return(data)

# Initialize variables
wsdl="http://www.jobs.ie/JobWS.asmx?WSDL" 	#The web service endpoint 

county_jobs = {}	#Variable to hold the json

fromDate = datetime.datetime(2018,6,6)  # The start date of jobs to search 
toDate = datetime.datetime(2018,6, 26)  # The end date of jobs to search 

#categories = {"Accountancy+Finance":21, "Banking+Insurance":126, "Education+Academic":[9, 269], \
#             "Construction+Engineering":2, "IT":4, "HR+Recruitment":124, "Graduate":125}
#counties = {"Carlow": 7, "Cavan": 8, "Clare": 9, "Cork": 10, "Donegal": 11, "Dublin": 5, "Galway": 12, "Kerry": 13, "Kildare": 14, "Kilkenny": 15, "Laois": 16, "Leitrim": 17, "Limerick": 18, "Longford": 19, "Louth": 20, "Mayo": 21, "Meath": 22, "Monaghan": 23, "Offaly": 24, "Roscommon": 25, "Sligo": 26, "Tipperary": 27, "Waterford": 28, "Westmeath": 29, "Wexford": 30, "Wicklow": 31}

categories = {"Accountancy+Finance":21, "Banking+Insurance":126, "Education+Academic":[9, 269]}
counties = {"Carlow": 7, "Cork": 10, "Dublin": 5, "Galway": 12}

for key, value in categories.items():  # Loop through the categories. A file will be created for each category.
    category_name = key
    CategoryIds = value 
    file_name = "/home/nana/" + category_name + ".json"
	
	# Loop of the counties dictionary. For each county, call the webservice and get the count of jobs. Then update the dictionary.
    county_jobs = dict.fromkeys(counties) 
    for key, value in counties.items():
        #print(value)
        county_name = key
        regionID = value
        data = get_job_list(wsdl, fromDate, toDate, regionID, CategoryIds)
        county_jobs[key] = data['recordCount']
    
	# Dump as json
    county_jobs_json = json.dumps(county_jobs)
    
	# Write to file
    with  open(file_name, 'w') as f_json: 
       f_json.write(county_jobs_json)
       f_json.close()        
