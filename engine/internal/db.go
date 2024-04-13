package main

import (
	"fmt"
	"path/filepath"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Marketplace struct {
	gorm.Model
	GitRemoteUrl string
	GitUsername string
	GitPassword string
}

var Db *gorm.DB

func init() {
	var databasePath = filepath.Join(DataPath, "db.sqlite")
	fmt.Printf("Connecting to the database %s\n", databasePath)
	database, err := gorm.Open(sqlite.Open(databasePath), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	fmt.Println("Successfully connected to the database")

	fmt.Println("Migrating the database")
	database.AutoMigrate(&Marketplace{})
	fmt.Println("Database migrated")

	// Seed the database if it is empty
	var count int64
	database.Raw("SELECT name FROM sqlite_master WHERE type='table';").Count(&count)
	if count == 0 {
		fmt.Println("Seeding the database")
		database.Create(&Marketplace{
			GitRemoteUrl: "https://github.com/home-station-org/apps.git",
			// TODO remove username and token once public
			GitUsername:  "Sharknoon",
			GitPassword:  "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",
		})
		fmt.Println("Successfully seeded the database")
	}
	Db = database
}