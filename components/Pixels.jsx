

export default function Pixels({pixelColors, onPixelClick}) {
  return (
    <div className="flex flex-col aspect-square flex-grow">
      {pixelColors.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="flex flex-grow"
        >
          {row.map((color, colIndex) => (
            <div
              key={colIndex}
              className={"flex-grow border  " + (color === 1 ? 'bg-black border-black' : 'bg-white border-gray-200')}
              onClick={() => {
                onPixelClick?.(rowIndex, colIndex)
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}