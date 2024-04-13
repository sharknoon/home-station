package main

import (
	"fmt"
	"os"
	"path/filepath"
	"runtime"
)

var DataPath string

func init() {
	var path = ""
	if os.Getenv("CONTAINERIZED") == "true" {
		path := "/data"
		if _, err := os.Stat(path); os.IsNotExist(err) {
			fmt.Println("Running in container, but the data directory isn't mounted. Using a temporary fallback path!")
			fmt.Println("-----------------------------------------------------")
			fmt.Println("| ALL DATA WILL BE LOST WHEN THE SERVER STOPS!      |")
			fmt.Printf("| Please mount the \"%s\" directory like this:     |\n", path)
			fmt.Printf("| docker run -v /path/to/data:%s ...             |", path)
			fmt.Println("-----------------------------------------------------")
			path = os.TempDir()
			os.MkdirAll(path, os.ModePerm)
		}
		fmt.Printf("Running in container, using \"%s\" as data directory\n", path)
	} else {
		// set the data path to the os homedir joined with .home-station
		dataPath := filepath.Join(os.Getenv("HOME"), "/.home-station")
		os.MkdirAll(dataPath, os.ModePerm)
		fmt.Printf("Running on \"%s\", using \"%s\" as data directory\n", runtime.GOOS, dataPath)
	}
	DataPath = path
}
