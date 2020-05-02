# from main import db, Pokemon, app
# import csv

# db.create_all(app=app);

# with open('pokemon.csv', encoding="utf-8") as csvfile:
#   data = csv.DictReader(csvfile, delimiter=',')
#   for line in data:
#     pokemon = Pokemon(name= line['name'], attack =line['attack'], defense = line['defense'],height= line['height_m'], weight= line['weight_kg'],sp_attack= line['sp_attack'],sp_defense= line['sp_defense'],type1= line['type1'], type2= line['type2'], hp= line['hp'], speed= line['speed'])
        
#     if pokemon.name =='':
#       pokemon.name ='None'
#     if pokemon.height =='':
#       pokemon.height ='None'
#     if pokemon.weight =='':
#       pokemon.weight ='None'
#     if pokemon.type1 =='':
#       pokemon.type1 ='None'
#     if pokemon.type2 =='':
#       pokemon.type2 = 'None'

#   db.session.add(pokemon)
#   db.session.commit()