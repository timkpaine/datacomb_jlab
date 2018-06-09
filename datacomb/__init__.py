import json
from IPython.display import display


def _df_to_datacomb(df):
    if 'index' not in df.columns:
        df = df.reset_index()
    rows = df.to_json(orient='records')
    columns = []
    for x in df.dtypes.iteritems():
        if 'object' in str(x[1]):
            columns.append({'label': x[0], 'accessor': x[0], 'type': 'discrete'})
        else:
            columns.append({'label': x[0], 'accessor': x[0]})
    return {'rows': rows, 'columns': json.dumps(columns)}


def datacomb(df):
    x = {}
    x['application/datacomb+json'] = _df_to_datacomb(df)
    return display(x, raw=True)
