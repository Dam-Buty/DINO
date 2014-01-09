#!/usr/bin/python
#
# DinoCave
# - Script de post-processing pour CUPS-PDF   
#   Identifie la queue d'origine d'un PDF, et le copie dans le repertoire adequat

import os
import sys
import shutil

# Le nom de fichier sera compose comme suit :
#      job_31-dino-cave_py.pdf
spool = os.path.split(sys.argv[1])[0]
filename = os.path.basename(sys.argv[1])
job = filename.split("-", 1)[0].split("_")[1]
pdf = filename.split("-", 1)[1]
original = pdf.split(".pdf")[0]

f_log = open(spool + "/test.txt", "a")
f_log.write("####### ####### #######")
f_log.write("Fichier    : " + filename)
f_log.write("Job        : " + job)

page_log = open("/var/log/cups/page_log", "r")

log = page_log.read()

# Les lignes de log ressemblent a ca :
# "dinotest chad 31 [02/Jan/2014:14:20:04 -0500] 1 1 - 201.141.17.161 dino-cave.py - -".split(" ")
# Et se splittent comme ca :
# 0 : imprimante
# 1 : user
# 2 : JOB
# 3-4 : timestamp
# 5-6-7 : 
# 8 : IP
# 9 : original filename 

# print original

for ligne in log.split("\n"):
    if ligne != "":
        elements = ligne.split(" ")
        # print elements
        
        imprimante = elements[0]
        job_log = elements[2]
        # original_log = elements[9].replace(" ", "_").replace(".", "_")
        
        if job_log == job:
            nom = spool + "/" + imprimante + "__" + pdf
            f_log.write("Imprimante : " + imprimante)
            f_log.write("Renomme en : " + nom)
            os.rename(sys.argv[1], nom)
            break


