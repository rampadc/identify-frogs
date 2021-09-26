import csv
import os
from urllib.request import urlretrieve

file_path = os.path.join( os.path.dirname( __file__ ), '..', '01_scrape_frog_calls', 'frogs.csv' )
save_folder = os.path.join( os.path.dirname( __file__ ), 'calls')

with open(file_path) as csvfile:
  reader = csv.reader(csvfile)
  next(reader, None)
  for row in reader:
    if row[2] == 'null':
      continue
    file_name = os.path.join(save_folder, f'{row[0]} - {row[1]}.m4a')
    urlretrieve(row[2], file_name)
