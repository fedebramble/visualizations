import plotly.graph_objects as go
import pandas as pd


file_path = 'titanic.csv'
df = pd.read_csv('titanic.csv')

#file_path = 'path/to/your/local/titanic.csv'
#df = pd.read_csv(file_path)

df1 = df.groupby(['Pclass', 'Sex'])['Name'].count().reset_index()
df1.columns = ['source', 'target', 'value']
df1['source'] = df1.source.map({1: 'Pclass1', 2: 'Pclass2', 3: 'Pclass3'})
df2 = df.groupby(['Sex', 'Survived'])['Name'].count().reset_index()
df2.columns = ['source', 'target', 'value']
df2['target'] = df2.target.map({1: 'Survived', 0: 'Died'})
links = pd.concat([df1, df2], axis=0)

unique_source_target = list(pd.unique(links[['source', 'target']].values.ravel('K')))

mapping_dict = {k: v for v, k in enumerate(unique_source_target)}

links['source'] = links['source'].map(mapping_dict)
links['target'] = links['target'].map(mapping_dict)

links_dict = links.to_dict(orient='list')

fig = go.Figure(data=[go.Sankey(
    node = dict(
      pad = 30,
      thickness = 20,
      line = dict(color = "black", width = 0.5),
      label = unique_source_target,
      color = "gray"
    ),
    link = dict(
      source = links_dict["source"],
      target = links_dict["target"],
      value = links_dict["value"]
  ))])

#fig.update_layout(title_text="Titanic Survival Sankey Diagram", font_size=10)
#fig.show()

fig.write_html('sankey.html')