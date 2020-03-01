import csv
from urllib.request import urlretrieve

with open('frogs.csv') as csvfile:
  reader = csv.reader(csvfile)
  next(reader, None);
  for row in reader:
    if row[2] == 'null':
      continue
    urlretrieve(row[2], f'{row[0]} - {row[1]}.m4a')
