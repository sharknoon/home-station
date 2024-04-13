package git

import (
	"github.com/go-git/go-git/v5"
	"github.com/go-git/go-git/v5/plumbing/transport/http"
)

func CloneRepository(url string, targetPath string, username string) {
	_, err := git.PlainClone(targetPath, false, &git.CloneOptions{
		URL: url,
	})

	if err != nil {
		panic(err)
	}
}

func CloneRepositoryWithAuth(url string, targetPath string, username string, password string) {
	_, err := git.PlainClone(targetPath, false, &git.CloneOptions{
		Auth: &http.BasicAuth{
			Username: username,
			Password: password,
		},
		URL: url,
	})

	if err != nil {
		panic(err)
	}
}

func PullRepository(path string) {
	r, err := git.PlainOpen(path)
	if err != nil {
		panic(err)
	}

	w, err := r.Worktree()
	if err != nil {
		panic(err)
	}

	err = w.Pull(&git.PullOptions{RemoteName: "origin"})
	if err != nil {
		panic(err)
	}

}
