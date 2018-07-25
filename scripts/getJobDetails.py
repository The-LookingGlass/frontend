
###############
# This script downloads the details for jobs. 
# It builds on the getJobListings.py script which simply downloads a listing of all available jobs by count 
# This script does the following:
# - Read each county job listing file from the disk
# - For each listing in each file, it:
#    -Calls the jobDetails Web service
#    -Gets the job details and saves to a file with the jobID
#################

######## Import libraries 
import zeep
import json
import csv
import datetime


######## Functions used in the script

# This function calls the jobs.ie GetJobDisplay service and retrieves details of the job
def get_job_details(wsdl, jobID):
    client = zeep.Client(wsdl=wsdl)
    with client.settings(strict=False):
        ws_data = client.service.GetJobDisplay(jobId=jobID) # Call the WS and pass the jobID in the call
        data = zeep.helpers.serialize_object(ws_data)   # By default Zeep returns a custom object type. The helper class changes this to a standard python structure.
    return(data)

# This class is used to handle serializing datetime objects for JSON (https://gist.github.com/drmalex07/5149635e6ab807c8b21e)
class Encoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.datetime):
            return obj.isoformat()
        else:
            return json.JSONEncoder.default(self, obj)


######## Variables used in the script
counties = {"Carlow": 7, "Cavan": 8, "Clare": 9, "Cork": 10, "Donegal": 11, "Dublin": 5, "Galway": 12, "Kerry": 13, "Kildare": 14, "Kilkenny": 15, "Laois": 16, "Leitrim": 17, "Limerick": 18, "Longford": 19, "Louth": 20, "Mayo": 21, "Meath": 22, "Monaghan": 23, "Offaly": 24, "Roscommon": 25, "Sligo": 26, "Tipperary": 27, "Waterford": 28, "Westmeath": 29, "Wexford": 30, "Wicklow": 31}

joblistings_file_path = '/home/nana/jobsie/' # The path to the county job listings files created by the getJobListings.py script

job_details_file = '/home/nana/jobsie/job_details/job_details.txt' # The file in which to store the downloaded job details

wsdl="file:///home/nana/JobWS.wsdl" # Copy of the wsdl from https://www.jobs.ie/JobWS.asmx?wsdl. The local copy gives a major performance boost!!


######### The actual program
#Load files from the disk
with open(job_details_file, 'a') as f_out: # open the job details file

  # Loop through the files of job listings (there is one file for every county). These are created when the getJobListings script runs.
  # Read in the data and dump json
    for county, code in counties.items(): 	    
        joblistings_file_name = '/home/nana/jobsie/' + county + '.json' 
        with open(joblistings_file_name, 'r') as f: 
            data = f.read()
        f.close()
        json_data = json.loads(data)
  # Extract the job ID from the json and call the web service to get the details
        for job in json_data:
            jobID = job['Id']
            job_details = json.dumps(get_job_details(wsdl, jobID), cls=Encodeme)
  # Write the details to file
            f_out.write(job_details+"\n")
f_out.close()

    

