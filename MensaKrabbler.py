
# crawl the website under https://www.studierendenwerk-stuttgart.de/essen/speiseplan

import warnings
import requests
from bs4 import BeautifulSoup
import pandas as pd
import re
import datetime
import os
import time
import random
import json
import numpy as np
import matplotlib.pyplot as plt
import locale


# POST /inc/ajax-php_konnektor.inc.php HTTP/1.1
# Content-Type: application/x-www-form-urlencoded; charset=UTF-8
# Accept: */*
# Accept-Language: en-us
# Accept-Encoding: gzip, deflate, br
# Host: sws2.maxmanager.xyz
# Origin: https://sws2.maxmanager.xyz
# User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15
# Connection: keep-alive
# Referer: https://sws2.maxmanager.xyz/index.php?mode=bed
# Content-Length: 95
# Cookie: domain=sws2.maxmanager.xyz; locId=2; savekennzfilterinput=0; splsws=rhom9pct0fu7q8rvhg6i51m0sc
# X-Requested-With: XMLHttpRequest

# Request Data
# MIME Type: application/x-www-form-urlencoded; charset=UTF-8
# func: make_spl
# locId: 2
# date: 2023-06-29
# lang: de
# startThisWeek: 2023-06-26
# startNextWeek: 2023-07-03

# create an enum for the weekdays to be passed to the run function
class Weekday:
    MONDAY = 0
    TUESDAY = 1
    WEDNESDAY = 2
    THURSDAY = 3
    FRIDAY = 4

    weekdays = [MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY]

# create a function that runs the whole script
def run(weekday: Weekday, ShouldReturnDataFrame: bool):
    # get the date of the passed weekday for the next occurence in format YYYY-MM-DD
    def get_date(weekday: Weekday):
        # make a switch case over the weekday enums
        switcher = {
            Weekday.MONDAY: 0,
            Weekday.TUESDAY: 1,
            Weekday.WEDNESDAY: 2,
            Weekday.THURSDAY: 3,
            Weekday.FRIDAY: 4
        }
        # get the date of the next occurence of the weekday
        date = datetime.date.today() + datetime.timedelta(days=(switcher.get(weekday) - datetime.date.today().weekday()) % 7)
        # return the date in format YYYY-MM-DD
        return date.strftime('%Y-%m-%d')

    def get_date_or_next_monday():
        if datetime.date.today().weekday() == 5:
            # get the date of the day after tomorrow
            return (datetime.date.today() + datetime.timedelta(days=2)).strftime('%Y-%m-%d')
        # check if today is sunday
        elif datetime.date.today().weekday() == 6:
            # get the date of tomorrow
            return (datetime.date.today() + datetime.timedelta(days=1)).strftime('%Y-%m-%d')
        else:
            return datetime.date.today().strftime('%Y-%m-%d')

    date = get_date(weekday)

    request = requests.post(
        url='https://sws2.maxmanager.xyz/inc/ajax-php_konnektor.inc.php',
        headers={
        #     'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        #     'Accept': '*/*',
        #     'Accept-Language': 'en-us',
        #     'Accept-Encoding': 'gzip, deflate, br',
            'Host': 'sws2.maxmanager.xyz',
            'Origin': 'https://sws2.maxmanager.xyz',
        #     'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15',
        #     'Connection': 'keep-alive',
            'Referer': 'https://sws2.maxmanager.xyz/index.php?mode=bed',
        #     'Content-Length': '95',
            'Cookie': 'domain=sws2.maxmanager.xyz; locId=2; savekennzfilterinput=0; splsws=rhom9pct0fu7q8rvhg6i51m0sc',
        #     'X-Requested-With': 'XMLHttpRequest'
        },
        data={
            'func': 'make_spl',
            'locId': '2',
            'date': {date},
            'lang': 'de',
            'startThisWeek': {
                # get the date of monday of the current week
                (datetime.date.today() - datetime.timedelta(days=datetime.date.today().weekday())).strftime('%Y-%m-%d')
            },
            'startNextWeek': {
                # get the date of monday of the next week
                (datetime.date.today() - datetime.timedelta(days=datetime.date.today().weekday()) + datetime.timedelta(days=7)).strftime('%Y-%m-%d')
            }
        }
    )

    
    # parse the html with BeautifulSoup
    soup = BeautifulSoup(request.text, 'html.parser')

    
    class Essen:
        def __init__(self, name, foto, preis, vegan, co2, nährwerte):
            self.name = name
            self.foto = foto
            self.preis = preis
            self.vegan = vegan
            self.co2 = co2
            self.nährwerte = nährwerte

    
    essens_liste = []

    for essen_div in soup.find_all(class_='row splMeal'):
        name = essen_div.find('span').text.strip()
        foto = essen_div.find('img')['src'] if essen_div.find('img') is not None else ''
        preis = 'leer' #essen_div.find(class_='col-md-2 col-sm-3 visible-sm-block visible-md-block visible-lg-block').div.text.strip()
        vegan_icon = essen_div.find(class_='iconLarge')
        if vegan_icon is None:
            vegan = "?"
        else:
            vegan = True if vegan_icon["title"] == "vegan" else False
        co2 = essen_div.find(class_='azn hidden size-13').find_all('div')[0].text.strip()
        nährwerte = essen_div.find(class_='azn hidden size-13').find_all('div')[1].text.strip()

        # find the price, it is a div that contains an € sign and a number in the text
        for div in essen_div.find_all('div'):
            if '€' in div.text:
                preis = div.text.strip()
                break

        essen = Essen(name, foto, preis, vegan, co2, nährwerte)
        essens_liste.append(essen)

    
    class EssenDetailed:
        def __init__(self, name, foto, preis, vegan, co2, brennwert, fett, ges_fett, kohlenhydrate, zucker, eiweiß, salz):
            self.name = name
            self.foto = foto
            self.preis = preis
            self.vegan = vegan
            self.co2 = co2
            self.brennwert = brennwert
            self.fett = fett
            self.ges_fett = ges_fett
            self.kohlenhydrate = kohlenhydrate
            self.zucker = zucker
            self.eiweiß = eiweiß
            self.salz = salz

    
    essens_liste_detailled = []

    for essen_div in soup.find_all(class_='row splMeal'):
        name = essen_div.find('span').text.strip()
        foto = essen_div.find('img')['src'] if essen_div.find('img') is not None else ''
        preis = 'leer'#essen_div.find(class_='col-md-2 col-sm-3 visible-sm-block visible-md-block visible-lg-block').div.text.strip()
        vegan_icon = essen_div.find(class_='iconLarge')
        if vegan_icon is None:
            vegan = "?"
        else:
            vegan = True if vegan_icon["title"] == "vegan" else False
        co2 = essen_div.find(class_='azn hidden size-13').find_all('div')[0].text.strip()
        nährwerte_div = essen_div.find(class_='azn hidden size-13').find_all('div')[1]
        
        # ignore warnings or dont print them in the console
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            brennwert = nährwerte_div.find('span', text='Brennwert:')
            brennwert = brennwert.next_sibling.strip() if brennwert else ''
            
            fett = nährwerte_div.find('span', text='Fett:')
            fett = fett.next_sibling.strip() if fett else ''
            
            ges_fett = nährwerte_div.find('span', text=' - davon ges. FS:')
            ges_fett = ges_fett.next_sibling.strip() if ges_fett else ''
            
            kohlenhydrate = nährwerte_div.find('span', text='Kohlenhydrate:')
            kohlenhydrate = kohlenhydrate.next_sibling.strip() if kohlenhydrate else ''
            
            zucker = nährwerte_div.find('span', text=' - davon Zucker:')
            zucker = zucker.next_sibling.strip() if zucker else ''
            
            eiweiß = nährwerte_div.find('span', text='Eiweiß:')
            eiweiß = eiweiß.next_sibling.strip() if eiweiß else ''
            
            salz = nährwerte_div.find('span', text='Salz:')
            salz = salz.next_sibling.strip() if salz else ''

        # find the price, it is a div that contains an € sign and a number in the text
        for div in essen_div.find_all('div'):
            if '€' in div.text:
                preis = div.text.strip()
                break

        essen = EssenDetailed(name, foto, preis, vegan, co2, brennwert, fett, ges_fett, kohlenhydrate, zucker, eiweiß, salz)
        essens_liste_detailled.append(essen)

    
    # Erstelle DataFrame
    data = {
        'Name': [essen.name for essen in essens_liste_detailled],
        'Foto': [essen.foto for essen in essens_liste_detailled],
        'Preis': [essen.preis for essen in essens_liste_detailled],
        'Vegan': [essen.vegan for essen in essens_liste_detailled],
        'CO2': [essen.co2 for essen in essens_liste_detailled],
        'Brennwert': [essen.brennwert for essen in essens_liste_detailled],
        'Fett': [essen.fett for essen in essens_liste_detailled],
        'Ges. Fett': [essen.ges_fett for essen in essens_liste_detailled],
        'Kohlenhydrate': [essen.kohlenhydrate for essen in essens_liste_detailled],
        'Zucker': [essen.zucker for essen in essens_liste_detailled],
        'Eiweiß': [essen.eiweiß for essen in essens_liste_detailled],
        'Salz': [essen.salz for essen in essens_liste_detailled]
    }

    df = pd.DataFrame(data)

    
    def clean_nutrition_data(row):
        co2_portion_start = row['CO2'].find('CO2 pro Portion') + len('CO2 pro Portion')
        co2_portion_end = row['CO2'].find(' g', co2_portion_start)
        row['CO2 pro Portion'] = row['CO2'][co2_portion_start:co2_portion_end]

        co2_100g_start = row['CO2'].find('CO2 pro 100 g') + len('CO2 pro 100 g')
        co2_100g_end = row['CO2'].find(' g', co2_100g_start)
        row['CO2 pro 100 g'] = row['CO2'][co2_100g_start:co2_100g_end]

        brennwert_start = row['CO2'].find('Brennwert:') + len('Brennwert:')
        brennwert_end = row['CO2'].find(' kcal', brennwert_start)
        row['Brennwert'] = row['CO2'][brennwert_start:brennwert_end]

        fett_start = row['CO2'].find('Fett:') + len('Fett:')
        fett_end = row['CO2'].find(' g', fett_start)
        row['Fett'] = row['CO2'][fett_start:fett_end]

        ges_fett_start = row['CO2'].find('davon ges. FS:') + len('davon ges. FS:')
        ges_fett_end = row['CO2'].find(' g', ges_fett_start)
        row['Ges. Fett'] = row['CO2'][ges_fett_start:ges_fett_end]

        kohlenhydrate_start = row['CO2'].find('Kohlenhydrate:') + len('Kohlenhydrate:')
        kohlenhydrate_end = row['CO2'].find(' g', kohlenhydrate_start)
        row['Kohlenhydrate'] = row['CO2'][kohlenhydrate_start:kohlenhydrate_end]

        zucker_start = row['CO2'].find('davon Zucker:') + len('davon Zucker:')
        zucker_end = row['CO2'].find(' g', zucker_start)
        row['Zucker'] = row['CO2'][zucker_start:zucker_end]

        eiweiß_start = row['CO2'].find('Eiweiß:') + len('Eiweiß:')
        eiweiß_end = row['CO2'].find(' g', eiweiß_start)
        row['Eiweiß'] = row['CO2'][eiweiß_start:eiweiß_end]

        salz_start = row['CO2'].find('Salz:') + len('Salz:')
        salz_end = row['CO2'].find(' g', salz_start)
        row['Salz'] = row['CO2'][salz_start:salz_end]

        return row

    
    # Annahme: Das DataFrame heißt df und die Spalte mit den Nährwertinformationen heißt 'CO2'
    df = df.apply(clean_nutrition_data, axis=1)

    
    # remove columns Foto and CO2
    df = df.drop(columns=['Foto', 'CO2'])

    
    # save df to two new dfs called df_raw and df_clean
    df_raw = df.copy()
    df_clean = df.copy()

    
    # clean the whole column Preis by extracting the number after the € sign
    df_clean['Preis'] = df_clean['Preis'].str.extract(r'€\s*(\d+,\d+)')
    df_clean['Preis'] = df_clean['Preis'].str.replace(',', '.').astype(float)

    
    # clean column Brennwert by splitting each value at the character 'kj /' and taking the last part
    df_clean['Brennwert'] = df_clean['Brennwert'].str.split(' kj /').str[-1]
    df_clean['Brennwert'] = df_clean['Brennwert'].astype(float)

    
    # remove the columns CO2 pro Portion and CO2 pro 100 g
    df_clean = df_clean.drop(columns=['CO2 pro Portion', 'CO2 pro 100 g'])

    
    # convert columns Fett, Ges. Fett, Kohlenhydrate, Zucker, Eiweiß and Salz to float
    df_clean['Fett'] = df_clean['Fett'].astype(float)
    df_clean['Ges. Fett'] = df_clean['Ges. Fett'].astype(float)
    df_clean['Kohlenhydrate'] = df_clean['Kohlenhydrate'].astype(float)
    df_clean['Zucker'] = df_clean['Zucker'].astype(float)
    df_clean['Eiweiß'] = df_clean['Eiweiß'].astype(float)
    df_clean['Salz'] = df_clean['Salz'].astype(float)

    
    # create new columnns 'Brennwert pro Preis' and 'Eiweiß pro Preis' by dividing the columns 'Brennwert' and 'Eiweiß' by the column 'Preis'
    df_clean['Brennwert pro Preis'] = (df_clean['Brennwert'] / df_clean['Preis']).round(1)
    df_clean['Eiweiß pro Preis'] = (df_clean['Eiweiß'] / df_clean['Preis']).round(1)

    # cut to one decimal place
    df_clean['Brennwert pro Preis'] = df_clean['Brennwert pro Preis'].round(1)
    df_clean['Eiweiß pro Preis'] = df_clean['Eiweiß pro Preis'].round(1)

    
    # create a new df called df_recommend where there are only meals with a 'Preis' higher than 1.5
    df_recommend = df_clean#[df_clean['Preis'] > 1.5]

    # show df_recommend sorted by 'Eiweiß pro Preis' and 'Brennwert pro Preis' in descending order
    df_recommend = df_recommend.sort_values(by=['Eiweiß pro Preis', 'Brennwert pro Preis'], ascending=False)

    #  if the 'Preis' is lower than 1.5 put them at the end of the df
    df_recommend = pd.concat([df_recommend[df_recommend['Preis'] > 1.5], df_recommend[df_recommend['Preis'] <= 1.5]])

    # get the weekday name of the date in german
    actual_location = locale.getlocale()
    locale.setlocale(locale.LC_TIME, 'de_DE')
    weekDayGerman = datetime.datetime.strptime(date, '%Y-%m-%d').strftime('%A')
    locale.setlocale(locale.LC_TIME, actual_location)

    # get the date in format: dd.mm.yyyy
    dateForOutput = datetime.datetime.strptime(date, '%Y-%m-%d').strftime('%d.%m.%Y')

    
    if ShouldReturnDataFrame:
        # change the nam of column 'Name' to datename and date
        df_recommend = df_recommend.rename(columns={'Name': 'Empfehlungen für ' + weekDayGerman+', '+ dateForOutput})
        return df_recommend
    else:
        result = ''
        print('Empfehlungen für '+weekDayGerman+', den '+dateForOutput+': ')
        result += 'Empfehlungen für '+weekDayGerman+', den '+dateForOutput+': '
        print('-------------------------------------------')
        result += '\n-------------------------------------------\n'
        print(df_recommend)
        result += df_recommend.to_string(index=False)

        return result

