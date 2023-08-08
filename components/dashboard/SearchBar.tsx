import { OutlinedInput, ThemeProvider, createTheme } from "@mui/material";
import { arEG } from "@mui/material/locale";
import { arSD as aer } from "@mui/x-data-grid";

const theme = createTheme(
  {
    // change font here
    typography: {
      fontFamily: ["Cairo", "Noto Kufi Arabic", "sans-serif"].join(","),
    },
    palette: {
      primary: { main: "#1976d2" },
    },
    //direction: 'rtl',
  },
  arEG, // x-data-grid translations
  aer // x-data-grid translations
);

type Props = {
  rows?: any[];
  handleSearch: any;
};

const SearchBar = ({ rows, handleSearch }: Props) => {
  return (
    <div className="flex items-center w-full relative md:w-64">
      <ThemeProvider theme={theme}>
        <OutlinedInput
          type="text"
          name="search"
          placeholder="ابحث عن ما تريد"
          className="bg-gray-100 my-3 border-none outline-none w-full px-2 rounded-md !text-slate-900 text-sm text-right flex-1 h-10 lg:text-md lg:h-12 lg:px-3 md:h-11"
          sx={{
            width: "100%",
            textAlign: "left",
            "& fieldset": {
              border: "none",
            },
          }}
          inputProps={{ style: { textAlign: "right" } }}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </ThemeProvider>
    </div>
  );
};

export default SearchBar;
