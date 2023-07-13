function printWeekday(weekday) {
    var outputText = document.getElementById("output-text");
    
    if (weekday == 1) {
        outputText.value = monday_string;
    } else if (weekday == 2) {
        outputText.value = tuesday_string;
    } else if (weekday == 3) {
        outputText.value = wednesday_string;
    } else if (weekday == 4) {
        outputText.value = thursday_string;
    } else if (weekday == 5) {
        outputText.value = friday_string;
    }
  }


monday_string = `Empfehlungen für Monday, den 2023-07-17: 
-------------------------------------------
                                                                           Name  Preis  Vegan  Brennwert  Fett  Ges. Fett  Kohlenhydrate  Zucker  Eiweiß  Salz  Brennwert pro Preis  Eiweiß pro Preis\
                                            Vollkornspaghetti mit Sojabolognese   2.99   True      698.0  12.2        2.2           99.2    17.4    40.2   7.2           233.444816         13.444816\
                               Fleischküchle mit Baked Beans und Kartoffelchips   5.40   True      999.9  62.2       15.4           96.1    17.1    42.1   6.7           185.166667          7.796296\
                                                           Schweizer Wurstsalat   5.20   True      840.0  58.2       24.6           39.4     3.2    38.8   5.8           161.538462          7.461538\
                                                                   Pizza Salami   8.50   True      879.0  36.6       21.5           85.5     8.5    47.4   7.2           103.411765          5.576471\
                                                                 Pizza Speziale   8.50   True      728.0  21.0        0.0          100.8     0.0    37.8   0.0            85.647059          4.447059\
                                                          Pizza mit Grillgemüse   8.50   True      793.0  18.5       10.3          114.8    28.7    36.9   4.9            93.294118          4.341176\
                                                     Pizza mit Büffelmozzarella   8.50   True      820.0  24.8        0.0          116.8     0.0    31.2   0.0            96.470588          3.670588\
                                                      Rösti mit Rahmchampignons   4.90   True      720.0  44.8        9.3           62.3     5.6    13.1   3.2           146.938776          2.673469\
                                                                    Salatbuffet   1.10   True      999.9 242.8       37.4          379.1   187.5    76.5  36.4           909.000000         69.545455\
Wok im OG: Gemüsewok Ingwer-Ananas mit Duftreis Hähnchenstreifen zum Wokgericht   1.10   True      766.0   5.0        1.0          128.6    39.0    42.9   6.3           696.363636         39.000000\
                                                                     Burger Bar   1.10   True      864.0  42.0       15.0           76.9    21.9    39.6   6.7           785.454545         36.000000\
                                Wok im OG: Gemüsewok Ingwer-Ananas mit Duftreis   1.10   True      648.0   3.1        0.4          127.2    38.4    19.9   4.8           589.090909         18.090909\
                                                               Aprikosenjoghurt   0.99   True      163.0   5.4        3.4           21.1    20.3     6.5   0.3           164.646465          6.565657\
                                                                 Kartoffelchips   1.19   True      478.0  29.0        2.9           46.2     1.1     5.5   1.2           401.680672          4.621849\
                                                                   Grüne Bohnen   0.99   True      105.0   4.3        2.3            8.1     2.3     4.2   0.6           106.060606          4.242424\
                                                          Petersilienkartoffeln   1.19   True      216.0   4.4        2.2           37.1     2.0     5.0   0.5           181.512605          4.201681\
                                                                      Asiasuppe   0.99   True       76.0   4.8        0.4            5.4     1.2     2.0   0.7            76.767677          2.020202\
                                                           Exotischer Obstsalat   1.19   True      128.0   0.3        0.2           28.7    27.5     1.0   0.0           107.563025          0.840336\
                                                                  Beilagensalat   0.99   True       10.0   0.1        0.0            1.1     0.9     0.8   0.1            10.101010          0.808081`;
tuesday_string = `Empfehlungen für Tuesday, den 2023-07-18: 
-------------------------------------------
                                                                           Name  Preis  Vegan  Brennwert  Fett  Ges. Fett  Kohlenhydrate  Zucker  Eiweiß  Salz  Brennwert pro Preis  Eiweiß pro Preis\
                                    Hähnchenkeule mit Chili-Dip und Tomatenreis   4.00   True      999.9  57.3       18.6           70.7    26.0    52.5   6.7           249.975000         13.125000\
                                                           Schweizer Wurstsalat   5.20   True      840.0  58.2       24.6           39.4     3.2    38.8   5.8           161.538462          7.461538\
                                    Currywurst mit Currysauce und Pommes frites   3.90   True      926.0  63.6       18.4           62.0    11.5    23.9   4.7           237.435897          6.128205\
                                                                   Pizza Salami   8.50   True      879.0  36.6       21.5           85.5     8.5    47.4   7.2           103.411765          5.576471\
                                                                 Pizza Speziale   8.50   True      728.0  21.0        0.0          100.8     0.0    37.8   0.0            85.647059          4.447059\
                                                          Pizza mit Grillgemüse   8.50   True      793.0  18.5       10.3          114.8    28.7    36.9   4.9            93.294118          4.341176\
                Grünkernpfanne mit Blumenkohl-Bohnengemüse und Möhren-Chili-Dip   2.99   True      431.0  18.1        2.8           51.2    17.7    11.1   2.3           144.147157          3.712375\
                                                     Pizza mit Büffelmozzarella   8.50   True      820.0  24.8        0.0          116.8     0.0    31.2   0.0            96.470588          3.670588\
                                                                    Salatbuffet   1.10   True      999.9 242.8       37.4          379.1   187.5    76.5  36.4           909.000000         69.545455\
Wok im OG: Gemüsewok Ingwer-Ananas mit Duftreis Hähnchenstreifen zum Wokgericht   1.10   True      766.0   5.0        1.0          128.6    39.0    42.9   6.3           696.363636         39.000000\
                                                                     Burger Bar   1.10   True      864.0  42.0       15.0           76.9    21.9    39.6   6.7           785.454545         36.000000\
                                Wok im OG: Gemüsewok Ingwer-Ananas mit Duftreis   1.10   True      648.0   3.1        0.4          127.2    38.4    19.9   4.8           589.090909         18.090909\
                                                                Käsesahne Creme   1.19   True      156.0   3.1        2.2           23.0    19.8     9.0   0.2           131.092437          7.563025\
                                                                  Buntes Gemüse   0.99   True      168.0   5.0        2.3           21.3     9.3     6.3   0.9           169.696970          6.363636\
                                                             Sahneschokopudding   1.19   True      346.0  17.9       12.4           39.1    27.6     6.3   0.4           290.756303          5.294118\
                                                                    Tomatenreis   0.99   True      239.0   4.7        2.2           43.5     3.7     4.7   0.8           241.414141          4.747475\
                                                                  Pommes frites   1.19   True      468.0  28.3        6.4           46.2     1.1     5.5   1.1           393.277311          4.621849\
                                                                 Pilzcremesuppe   0.99   True       91.0   6.2        3.8            4.9     1.1     3.8   0.6            91.919192          3.838384\
                                                                  Beilagensalat   0.99   True       10.0   0.1        0.0            1.1     0.9     0.8   0.1            10.101010          0.808081`;
wednesday_string = `Empfehlungen für Wednesday, den 2023-07-19: 
-------------------------------------------
                                                                           Name  Preis  Vegan  Brennwert  Fett  Ges. Fett  Kohlenhydrate  Zucker  Eiweiß  Salz  Brennwert pro Preis  Eiweiß pro Preis\
                      Cordon bleu vom Schwein mit Bratensauce und Pommes frites   5.40   True      999.9  76.7       26.2           62.7     6.8    70.9   3.1           185.166667         13.129630\
                                                                   Bami Noodles   3.90   True      510.0   7.7        1.2           71.8    22.0    33.8   7.8           130.769231          8.666667\
                                       Rotes-Linsen-Kartoffel-Curry mit Rosinen   2.99   True      464.0   2.5        0.4           80.7     9.9    24.0   0.6           155.183946          8.026756\
                                                           Schweizer Wurstsalat   5.20   True      840.0  58.2       24.6           39.4     3.2    38.8   5.8           161.538462          7.461538\
                                                                   Pizza Salami   8.50   True      879.0  36.6       21.5           85.5     8.5    47.4   7.2           103.411765          5.576471\
                                                                 Pizza Speziale   8.50   True      728.0  21.0        0.0          100.8     0.0    37.8   0.0            85.647059          4.447059\
                                                          Pizza mit Grillgemüse   8.50   True      793.0  18.5       10.3          114.8    28.7    36.9   4.9            93.294118          4.341176\
                                                     Pizza mit Büffelmozzarella   8.50   True      820.0  24.8        0.0          116.8     0.0    31.2   0.0            96.470588          3.670588\
                                                                    Salatbuffet   1.10   True      999.9 242.8       37.4          379.1   187.5    76.5  36.4           909.000000         69.545455\
Wok im OG: Gemüsewok Ingwer-Ananas mit Duftreis Hähnchenstreifen zum Wokgericht   1.10   True      766.0   5.0        1.0          128.6    39.0    42.9   6.3           696.363636         39.000000\
                                                                     Burger Bar   1.10   True      864.0  42.0       15.0           76.9    21.9    39.6   6.7           785.454545         36.000000\
                                Wok im OG: Gemüsewok Ingwer-Ananas mit Duftreis   1.10   True      648.0   3.1        0.4          127.2    38.4    19.9   4.8           589.090909         18.090909\
                                                                   Früchtemüsli   1.19   True      253.0   6.6        2.1           35.7    19.2    11.1   0.2           212.605042          9.327731\
                                               Romanesco mit gerösteten Mandeln   0.99   True      145.0   6.2        2.4           12.4     6.1     6.7   0.5           146.464646          6.767677\
                                                                 Salzkartoffeln   0.99   True      178.0   0.3        0.0           37.0     2.0     5.0   0.5           179.797980          5.050505\
                                                             Mousse au chocolat   1.19  False      223.0  11.7        7.9           22.5    18.3     5.8   0.2           187.394958          4.873950\
                                                                  Pommes frites   1.19   True      468.0  28.3        6.4           46.2     1.1     5.5   1.1           393.277311          4.621849\
                                                                Gemüserahmsuppe   0.99   True      137.0  11.6        6.8            5.9     2.1     1.8   0.3           138.383838          1.818182\
                                                                  Beilagensalat   0.99   True       10.0   0.1        0.0            1.1     0.9     0.8   0.1            10.101010          0.808081`;
thursday_string = `Empfehlungen für Thursday, den 2023-07-13: 
-------------------------------------------
                                                                                         Name  Preis  Vegan  Brennwert  Fett  Ges. Fett  Kohlenhydrate  Zucker  Eiweiß  Salz  Brennwert pro Preis  Eiweiß pro Preis\
                                Paniertes Schweineschnitzel mit Bratensauce und Pommes frites   4.70   True      941.0  52.4        9.3           78.7     5.0    35.6   3.7           200.212766          7.574468\
                                                 Bunter Salatteller mit Hähnchenbruststreifen   5.20   True      297.0  11.9        1.7           14.2    12.8    30.3   5.5            57.115385          5.826923\
                                                         Bunter Salatteller veganes Schnitzel   5.20   True      789.0  51.2        7.4           49.6    10.6    29.6   3.0           151.730769          5.692308\
                                                                                 Pizza Salami   8.50   True      879.0  36.6       21.5           85.5     8.5    47.4   7.2           103.411765          5.576471\
                       Überbackener Blumenkohl mit Kräuterrahmsauce und Petersilienkartoffeln   4.20   True      676.0  37.1       21.5           57.6    11.3    23.2   1.8           160.952381          5.523810\
                                                                      Kartoffel-Gemüse-Pfanne   2.99   True      399.0  15.1        1.8           44.2    13.2    15.4   0.9           133.444816          5.150502\
                                                                               Pizza Speziale   8.50   True      728.0  21.0        0.0          100.8     0.0    37.8   0.0            85.647059          4.447059\
                                                                        Pizza mit Grillgemüse   8.50   True      793.0  18.5       10.3          114.8    28.7    36.9   4.9            93.294118          4.341176\
                                                                   Pizza mit Büffelmozzarella   8.50   True      820.0  24.8        0.0          116.8     0.0    31.2   0.0            96.470588          3.670588\
                                                                                  Salatbuffet   1.10   True      999.9 242.8       37.4          379.1   187.5    76.5  36.4           909.000000         69.545455\
Wok im OG: Gemüsewok Rotes Thai Curry mit Mienudeln Würziges Rinderhackfleisch zum Wokgericht   1.10   True      768.0  18.8        9.5           96.4    30.3    44.8  10.8           698.181818         40.727273\
                                                                                   Burger Bar   1.10   True      864.0  42.0       15.0           76.9    21.9    39.6   6.7           785.454545         36.000000\
                                          Wok im OG: Gemüsewok Rotes Thai Curry mit Mienudeln   1.10   True      535.0   7.5        4.9           95.6    30.0    15.5   7.1           486.363636         14.090909\
                                                                                 Himbeerquark   1.19   True      159.0   0.6        0.0           21.4    21.4    15.2   0.2           133.613445         12.773109\
                                                                               Vanillejoghurt   0.99   True      181.0   5.4        3.4           26.5    25.6     6.3   0.2           182.828283          6.363636\
                                                                               Salzkartoffeln   0.99   True      178.0   0.3        0.0           37.0     2.0     5.0   0.5           179.797980          5.050505\
                                                                                Pommes frites   1.19   True      468.0  28.3        6.4           46.2     1.1     5.5   1.1           393.277311          4.621849\
                                                                                  Chinagemüse   0.99   True      382.0   2.7        1.3            6.6     4.1     3.8   0.9           385.858586          3.838384\
                                                                                 Tomatensuppe   0.99   True       69.0   1.7        0.3            9.5     7.0     2.2   0.1            69.696970          2.222222\
                                                                                Beilagensalat   0.99   True       10.0   0.1        0.0            1.1     0.9     0.8   0.1            10.101010          0.808081`;
friday_string = `Empfehlungen für Friday, den 2023-07-14: 
-------------------------------------------
                                                                                         Name  Preis  Vegan  Brennwert  Fett  Ges. Fett  Kohlenhydrate  Zucker  Eiweiß  Salz  Brennwert pro Preis  Eiweiß pro Preis\
                                Schlemmerfilet à la bordelaise mit Dillsauce und Vollkornreis   4.60   True      716.0  31.0        6.8           76.3     2.4    30.1   4.1           155.652174          6.543478\
                                                 Falafel mit Gemüse-Couscous und Knoblauchdip   4.30   True      999.9 101.7       11.1          111.7    10.1    27.8   3.6           232.534884          6.465116\
                                               Bunter Salatteller Paniertes Schweineschnitzel   5.20   True      627.0  33.5        3.7           45.8    20.3    32.5   6.0           120.576923          6.250000\
                                                         Bunter Salatteller veganes Schnitzel   5.20   True      806.0  53.0        7.5           49.6    10.6    29.6   3.0           155.000000          5.692308\
                                                                                 Pizza Salami   8.50   True      879.0  36.6       21.5           85.5     8.5    47.4   7.2           103.411765          5.576471\
                                           Tomaten-Spaghetti mit Erbsencreme und Chiliflocken   2.99   True      600.0  16.5        2.5           94.0     8.8    15.5   6.0           200.668896          5.183946\
                                                                               Pizza Speziale   8.50   True      728.0  21.0        0.0          100.8     0.0    37.8   0.0            85.647059          4.447059\
                                                                        Pizza mit Grillgemüse   8.50   True      793.0  18.5       10.3          114.8    28.7    36.9   4.9            93.294118          4.341176\
                                                                   Pizza mit Büffelmozzarella   8.50   True      820.0  24.8        0.0          116.8     0.0    31.2   0.0            96.470588          3.670588\
                                                                                  Salatbuffet   1.10   True      999.9 242.8       37.4          379.1   187.5    76.5  36.4           909.000000         69.545455\
Wok im OG: Gemüsewok Rotes Thai Curry mit Mienudeln Würziges Rinderhackfleisch zum Wokgericht   1.10   True      768.0  18.8        9.5           96.4    30.3    44.8  10.8           698.181818         40.727273\
                                                                                   Burger Bar   1.10   True      864.0  42.0       15.0           76.9    21.9    39.6   6.7           785.454545         36.000000\
                                          Wok im OG: Gemüsewok Rotes Thai Curry mit Mienudeln   1.10   True      535.0   7.5        4.9           95.6    30.0    15.5   7.1           486.363636         14.090909\
                                                                              Gemüse-Couscous   1.19   True      511.0  12.9        3.2           79.4     6.9    15.7   1.6           429.411765         13.193277\
                                                                       FairTrade Bananenquark   1.19   True      244.0   5.1        3.0           38.9    27.2     9.8   0.2           205.042017          8.235294\
                                                                                 Vollkornreis   0.99   True      253.0   2.0        0.5           51.8     0.4     5.6   0.5           255.555556          5.656566\
                                                                                Pommes frites   1.19   True      468.0  28.3        6.4           46.2     1.1     5.5   1.1           393.277311          4.621849\
                                                                              Blumenkohlsuppe   0.99   True      172.0  12.0        6.9           10.6     4.4     4.5   0.6           173.737374          4.545455\
                                                                              Karamellpudding   1.19   True      277.0  11.8        7.8           38.0    30.0     5.4   0.5           232.773109          4.537815\
                                                                                 Balkangemüse   0.99   True      129.0   4.6        2.3           14.4     9.3     4.3   0.6           130.303030          4.343434\
                                                                                Beilagensalat   0.99   True       10.0   0.1        0.0            1.1     0.9     0.8   0.1            10.101010          0.808081`;


monday_string = `Empfehlungen für Monday, den 2023-07-17: 
-------------------------------------------
                                                                           Name  Preis  Vegan  Brennwert  Fett  Ges. Fett  Kohlenhydrate  Zucker  Eiweiß  Salz  Brennwert pro Preis  Eiweiß pro Preis\
                                            Vollkornspaghetti mit Sojabolognese   2.99   True      698.0  12.2        2.2           99.2    17.4    40.2   7.2           233.444816         13.444816\
                               Fleischküchle mit Baked Beans und Kartoffelchips   5.40   True      999.9  62.2       15.4           96.1    17.1    42.1   6.7           185.166667          7.796296\
                                                           Schweizer Wurstsalat   5.20   True      840.0  58.2       24.6           39.4     3.2    38.8   5.8           161.538462          7.461538\
                                                                   Pizza Salami   8.50   True      879.0  36.6       21.5           85.5     8.5    47.4   7.2           103.411765          5.576471\
                                                                 Pizza Speziale   8.50   True      728.0  21.0        0.0          100.8     0.0    37.8   0.0            85.647059          4.447059\
                                                          Pizza mit Grillgemüse   8.50   True      793.0  18.5       10.3          114.8    28.7    36.9   4.9            93.294118          4.341176\
                                                     Pizza mit Büffelmozzarella   8.50   True      820.0  24.8        0.0          116.8     0.0    31.2   0.0            96.470588          3.670588\
                                                      Rösti mit Rahmchampignons   4.90   True      720.0  44.8        9.3           62.3     5.6    13.1   3.2           146.938776          2.673469\
                                                                    Salatbuffet   1.10   True      999.9 242.8       37.4          379.1   187.5    76.5  36.4           909.000000         69.545455\
Wok im OG: Gemüsewok Ingwer-Ananas mit Duftreis Hähnchenstreifen zum Wokgericht   1.10   True      766.0   5.0        1.0          128.6    39.0    42.9   6.3           696.363636         39.000000\
                                                                     Burger Bar   1.10   True      864.0  42.0       15.0           76.9    21.9    39.6   6.7           785.454545         36.000000\
                                Wok im OG: Gemüsewok Ingwer-Ananas mit Duftreis   1.10   True      648.0   3.1        0.4          127.2    38.4    19.9   4.8           589.090909         18.090909\
                                                               Aprikosenjoghurt   0.99   True      163.0   5.4        3.4           21.1    20.3     6.5   0.3           164.646465          6.565657\
                                                                 Kartoffelchips   1.19   True      478.0  29.0        2.9           46.2     1.1     5.5   1.2           401.680672          4.621849\
                                                                   Grüne Bohnen   0.99   True      105.0   4.3        2.3            8.1     2.3     4.2   0.6           106.060606          4.242424\
                                                          Petersilienkartoffeln   1.19   True      216.0   4.4        2.2           37.1     2.0     5.0   0.5           181.512605          4.201681\
                                                                      Asiasuppe   0.99   True       76.0   4.8        0.4            5.4     1.2     2.0   0.7            76.767677          2.020202\
                                                           Exotischer Obstsalat   1.19   True      128.0   0.3        0.2           28.7    27.5     1.0   0.0           107.563025          0.840336\
                                                                  Beilagensalat   0.99   True       10.0   0.1        0.0            1.1     0.9     0.8   0.1            10.101010          0.808081`;
tuesday_string = `Empfehlungen für Tuesday, den 2023-07-18: 
-------------------------------------------
                                                                           Name  Preis  Vegan  Brennwert  Fett  Ges. Fett  Kohlenhydrate  Zucker  Eiweiß  Salz  Brennwert pro Preis  Eiweiß pro Preis\
                                    Hähnchenkeule mit Chili-Dip und Tomatenreis   4.00   True      999.9  57.3       18.6           70.7    26.0    52.5   6.7           249.975000         13.125000\
                                                           Schweizer Wurstsalat   5.20   True      840.0  58.2       24.6           39.4     3.2    38.8   5.8           161.538462          7.461538\
                                    Currywurst mit Currysauce und Pommes frites   3.90   True      926.0  63.6       18.4           62.0    11.5    23.9   4.7           237.435897          6.128205\
                                                                   Pizza Salami   8.50   True      879.0  36.6       21.5           85.5     8.5    47.4   7.2           103.411765          5.576471\
                                                                 Pizza Speziale   8.50   True      728.0  21.0        0.0          100.8     0.0    37.8   0.0            85.647059          4.447059\
                                                          Pizza mit Grillgemüse   8.50   True      793.0  18.5       10.3          114.8    28.7    36.9   4.9            93.294118          4.341176\
                Grünkernpfanne mit Blumenkohl-Bohnengemüse und Möhren-Chili-Dip   2.99   True      431.0  18.1        2.8           51.2    17.7    11.1   2.3           144.147157          3.712375\
                                                     Pizza mit Büffelmozzarella   8.50   True      820.0  24.8        0.0          116.8     0.0    31.2   0.0            96.470588          3.670588\
                                                                    Salatbuffet   1.10   True      999.9 242.8       37.4          379.1   187.5    76.5  36.4           909.000000         69.545455\
Wok im OG: Gemüsewok Ingwer-Ananas mit Duftreis Hähnchenstreifen zum Wokgericht   1.10   True      766.0   5.0        1.0          128.6    39.0    42.9   6.3           696.363636         39.000000\
                                                                     Burger Bar   1.10   True      864.0  42.0       15.0           76.9    21.9    39.6   6.7           785.454545         36.000000\
                                Wok im OG: Gemüsewok Ingwer-Ananas mit Duftreis   1.10   True      648.0   3.1        0.4          127.2    38.4    19.9   4.8           589.090909         18.090909\
                                                                Käsesahne Creme   1.19   True      156.0   3.1        2.2           23.0    19.8     9.0   0.2           131.092437          7.563025\
                                                                  Buntes Gemüse   0.99   True      168.0   5.0        2.3           21.3     9.3     6.3   0.9           169.696970          6.363636\
                                                             Sahneschokopudding   1.19   True      346.0  17.9       12.4           39.1    27.6     6.3   0.4           290.756303          5.294118\
                                                                    Tomatenreis   0.99   True      239.0   4.7        2.2           43.5     3.7     4.7   0.8           241.414141          4.747475\
                                                                  Pommes frites   1.19   True      468.0  28.3        6.4           46.2     1.1     5.5   1.1           393.277311          4.621849\
                                                                 Pilzcremesuppe   0.99   True       91.0   6.2        3.8            4.9     1.1     3.8   0.6            91.919192          3.838384\
                                                                  Beilagensalat   0.99   True       10.0   0.1        0.0            1.1     0.9     0.8   0.1            10.101010          0.808081`;
wednesday_string = `Empfehlungen für Wednesday, den 2023-07-19: 
-------------------------------------------
                                                                           Name  Preis  Vegan  Brennwert  Fett  Ges. Fett  Kohlenhydrate  Zucker  Eiweiß  Salz  Brennwert pro Preis  Eiweiß pro Preis\
                      Cordon bleu vom Schwein mit Bratensauce und Pommes frites   5.40   True      999.9  76.7       26.2           62.7     6.8    70.9   3.1           185.166667         13.129630\
                                                                   Bami Noodles   3.90   True      510.0   7.7        1.2           71.8    22.0    33.8   7.8           130.769231          8.666667\
                                       Rotes-Linsen-Kartoffel-Curry mit Rosinen   2.99   True      464.0   2.5        0.4           80.7     9.9    24.0   0.6           155.183946          8.026756\
                                                           Schweizer Wurstsalat   5.20   True      840.0  58.2       24.6           39.4     3.2    38.8   5.8           161.538462          7.461538\
                                                                   Pizza Salami   8.50   True      879.0  36.6       21.5           85.5     8.5    47.4   7.2           103.411765          5.576471\
                                                                 Pizza Speziale   8.50   True      728.0  21.0        0.0          100.8     0.0    37.8   0.0            85.647059          4.447059\
                                                          Pizza mit Grillgemüse   8.50   True      793.0  18.5       10.3          114.8    28.7    36.9   4.9            93.294118          4.341176\
                                                     Pizza mit Büffelmozzarella   8.50   True      820.0  24.8        0.0          116.8     0.0    31.2   0.0            96.470588          3.670588\
                                                                    Salatbuffet   1.10   True      999.9 242.8       37.4          379.1   187.5    76.5  36.4           909.000000         69.545455\
Wok im OG: Gemüsewok Ingwer-Ananas mit Duftreis Hähnchenstreifen zum Wokgericht   1.10   True      766.0   5.0        1.0          128.6    39.0    42.9   6.3           696.363636         39.000000\
                                                                     Burger Bar   1.10   True      864.0  42.0       15.0           76.9    21.9    39.6   6.7           785.454545         36.000000\
                                Wok im OG: Gemüsewok Ingwer-Ananas mit Duftreis   1.10   True      648.0   3.1        0.4          127.2    38.4    19.9   4.8           589.090909         18.090909\
                                                                   Früchtemüsli   1.19   True      253.0   6.6        2.1           35.7    19.2    11.1   0.2           212.605042          9.327731\
                                               Romanesco mit gerösteten Mandeln   0.99   True      145.0   6.2        2.4           12.4     6.1     6.7   0.5           146.464646          6.767677\
                                                                 Salzkartoffeln   0.99   True      178.0   0.3        0.0           37.0     2.0     5.0   0.5           179.797980          5.050505\
                                                             Mousse au chocolat   1.19  False      223.0  11.7        7.9           22.5    18.3     5.8   0.2           187.394958          4.873950\
                                                                  Pommes frites   1.19   True      468.0  28.3        6.4           46.2     1.1     5.5   1.1           393.277311          4.621849\
                                                                Gemüserahmsuppe   0.99   True      137.0  11.6        6.8            5.9     2.1     1.8   0.3           138.383838          1.818182\
                                                                  Beilagensalat   0.99   True       10.0   0.1        0.0            1.1     0.9     0.8   0.1            10.101010          0.808081`;
thursday_string = `Empfehlungen für Thursday, den 2023-07-13: 
-------------------------------------------
                                                                                         Name  Preis  Vegan  Brennwert  Fett  Ges. Fett  Kohlenhydrate  Zucker  Eiweiß  Salz  Brennwert pro Preis  Eiweiß pro Preis\
                                Paniertes Schweineschnitzel mit Bratensauce und Pommes frites   4.70   True      941.0  52.4        9.3           78.7     5.0    35.6   3.7           200.212766          7.574468\
                                                 Bunter Salatteller mit Hähnchenbruststreifen   5.20   True      297.0  11.9        1.7           14.2    12.8    30.3   5.5            57.115385          5.826923\
                                                         Bunter Salatteller veganes Schnitzel   5.20   True      789.0  51.2        7.4           49.6    10.6    29.6   3.0           151.730769          5.692308\
                                                                                 Pizza Salami   8.50   True      879.0  36.6       21.5           85.5     8.5    47.4   7.2           103.411765          5.576471\
                       Überbackener Blumenkohl mit Kräuterrahmsauce und Petersilienkartoffeln   4.20   True      676.0  37.1       21.5           57.6    11.3    23.2   1.8           160.952381          5.523810\
                                                                      Kartoffel-Gemüse-Pfanne   2.99   True      399.0  15.1        1.8           44.2    13.2    15.4   0.9           133.444816          5.150502\
                                                                               Pizza Speziale   8.50   True      728.0  21.0        0.0          100.8     0.0    37.8   0.0            85.647059          4.447059\
                                                                        Pizza mit Grillgemüse   8.50   True      793.0  18.5       10.3          114.8    28.7    36.9   4.9            93.294118          4.341176\
                                                                   Pizza mit Büffelmozzarella   8.50   True      820.0  24.8        0.0          116.8     0.0    31.2   0.0            96.470588          3.670588\
                                                                                  Salatbuffet   1.10   True      999.9 242.8       37.4          379.1   187.5    76.5  36.4           909.000000         69.545455\
Wok im OG: Gemüsewok Rotes Thai Curry mit Mienudeln Würziges Rinderhackfleisch zum Wokgericht   1.10   True      768.0  18.8        9.5           96.4    30.3    44.8  10.8           698.181818         40.727273\
                                                                                   Burger Bar   1.10   True      864.0  42.0       15.0           76.9    21.9    39.6   6.7           785.454545         36.000000\
                                          Wok im OG: Gemüsewok Rotes Thai Curry mit Mienudeln   1.10   True      535.0   7.5        4.9           95.6    30.0    15.5   7.1           486.363636         14.090909\
                                                                                 Himbeerquark   1.19   True      159.0   0.6        0.0           21.4    21.4    15.2   0.2           133.613445         12.773109\
                                                                               Vanillejoghurt   0.99   True      181.0   5.4        3.4           26.5    25.6     6.3   0.2           182.828283          6.363636\
                                                                               Salzkartoffeln   0.99   True      178.0   0.3        0.0           37.0     2.0     5.0   0.5           179.797980          5.050505\
                                                                                Pommes frites   1.19   True      468.0  28.3        6.4           46.2     1.1     5.5   1.1           393.277311          4.621849\
                                                                                  Chinagemüse   0.99   True      382.0   2.7        1.3            6.6     4.1     3.8   0.9           385.858586          3.838384\
                                                                                 Tomatensuppe   0.99   True       69.0   1.7        0.3            9.5     7.0     2.2   0.1            69.696970          2.222222\
                                                                                Beilagensalat   0.99   True       10.0   0.1        0.0            1.1     0.9     0.8   0.1            10.101010          0.808081`;
friday_string = `Empfehlungen für Friday, den 2023-07-14: 
-------------------------------------------
                                                                                         Name  Preis  Vegan  Brennwert  Fett  Ges. Fett  Kohlenhydrate  Zucker  Eiweiß  Salz  Brennwert pro Preis  Eiweiß pro Preis\
                                Schlemmerfilet à la bordelaise mit Dillsauce und Vollkornreis   4.60   True      716.0  31.0        6.8           76.3     2.4    30.1   4.1           155.652174          6.543478\
                                                 Falafel mit Gemüse-Couscous und Knoblauchdip   4.30   True      999.9 101.7       11.1          111.7    10.1    27.8   3.6           232.534884          6.465116\
                                               Bunter Salatteller Paniertes Schweineschnitzel   5.20   True      627.0  33.5        3.7           45.8    20.3    32.5   6.0           120.576923          6.250000\
                                                         Bunter Salatteller veganes Schnitzel   5.20   True      806.0  53.0        7.5           49.6    10.6    29.6   3.0           155.000000          5.692308\
                                                                                 Pizza Salami   8.50   True      879.0  36.6       21.5           85.5     8.5    47.4   7.2           103.411765          5.576471\
                                           Tomaten-Spaghetti mit Erbsencreme und Chiliflocken   2.99   True      600.0  16.5        2.5           94.0     8.8    15.5   6.0           200.668896          5.183946\
                                                                               Pizza Speziale   8.50   True      728.0  21.0        0.0          100.8     0.0    37.8   0.0            85.647059          4.447059\
                                                                        Pizza mit Grillgemüse   8.50   True      793.0  18.5       10.3          114.8    28.7    36.9   4.9            93.294118          4.341176\
                                                                   Pizza mit Büffelmozzarella   8.50   True      820.0  24.8        0.0          116.8     0.0    31.2   0.0            96.470588          3.670588\
                                                                                  Salatbuffet   1.10   True      999.9 242.8       37.4          379.1   187.5    76.5  36.4           909.000000         69.545455\
Wok im OG: Gemüsewok Rotes Thai Curry mit Mienudeln Würziges Rinderhackfleisch zum Wokgericht   1.10   True      768.0  18.8        9.5           96.4    30.3    44.8  10.8           698.181818         40.727273\
                                                                                   Burger Bar   1.10   True      864.0  42.0       15.0           76.9    21.9    39.6   6.7           785.454545         36.000000\
                                          Wok im OG: Gemüsewok Rotes Thai Curry mit Mienudeln   1.10   True      535.0   7.5        4.9           95.6    30.0    15.5   7.1           486.363636         14.090909\
                                                                              Gemüse-Couscous   1.19   True      511.0  12.9        3.2           79.4     6.9    15.7   1.6           429.411765         13.193277\
                                                                       FairTrade Bananenquark   1.19   True      244.0   5.1        3.0           38.9    27.2     9.8   0.2           205.042017          8.235294\
                                                                                 Vollkornreis   0.99   True      253.0   2.0        0.5           51.8     0.4     5.6   0.5           255.555556          5.656566\
                                                                                Pommes frites   1.19   True      468.0  28.3        6.4           46.2     1.1     5.5   1.1           393.277311          4.621849\
                                                                              Blumenkohlsuppe   0.99   True      172.0  12.0        6.9           10.6     4.4     4.5   0.6           173.737374          4.545455\
                                                                              Karamellpudding   1.19   True      277.0  11.8        7.8           38.0    30.0     5.4   0.5           232.773109          4.537815\
                                                                                 Balkangemüse   0.99   True      129.0   4.6        2.3           14.4     9.3     4.3   0.6           130.303030          4.343434\
                                                                                Beilagensalat   0.99   True       10.0   0.1        0.0            1.1     0.9     0.8   0.1            10.101010          0.808081`;
