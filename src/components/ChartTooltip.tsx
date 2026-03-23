export const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <div>
          {payload.map((pld: any) => (
            <div style={{ display: "inline-block", padding: 10 }}>
              <div>
                {pld.name}: {parseFloat(pld.value).toFixed(2)}
              </div>
              <div>{pld.dataKey}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};
