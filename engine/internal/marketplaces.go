package main

func CreateMarketplaceWithAuth(gitRemoteUrl string, gitUsername string, gitPassword string) {
	CloneRepositoryWithAuth(gitRemoteUrl, DataPath, gitUsername, gitPassword)

	Db.Create(&Marketplace{
		GitRemoteUrl: gitRemoteUrl,
		GitUsername:  gitUsername,
		GitPassword:  gitPassword,
	})
}