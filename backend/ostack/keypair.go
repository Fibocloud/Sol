package ostack

import (
	"github.com/gophercloud/gophercloud"
	"github.com/gophercloud/gophercloud/openstack"
	"github.com/gophercloud/gophercloud/openstack/compute/v2/extensions/keypairs"
	"github.com/gophercloud/gophercloud/pagination"
)

type Keypair struct {
	Client *gophercloud.ServiceClient
}

func (provider *Provider) Keypair() *Keypair {
	client, err := openstack.NewComputeV2(provider.ProviderClient, gophercloud.EndpointOpts{
		Region: "RegionOne",
	})
	if err != nil {
		panic(err)
	}
	return &Keypair{Client: client}
}

func (i *Keypair) List() ([]keypairs.KeyPair, error) {
	pager := keypairs.List(i.Client, nil)
	var result []keypairs.KeyPair
	err := pager.EachPage(func(page pagination.Page) (bool, error) {
		keypairList, err := keypairs.ExtractKeyPairs(page)
		if err != nil {
			return false, err
		}
		for _, keypair := range keypairList {
			result = append(result, keypair)
		}
		return true, nil
	})
	return result, err
}

func (i *Keypair) Get(name string) (*keypairs.KeyPair, error) {
	return keypairs.Get(i.Client, name, nil).Extract()
}

type KeypairCreateInput struct {
	Name      string `json:"name" binding:"required"`
	PublicKey string `json:"public_key"`
}

func (i *Keypair) Create(input KeypairCreateInput) (*keypairs.KeyPair, error) {
	return keypairs.Create(i.Client, keypairs.CreateOpts{
		Type:      "ssh",
		Name:      input.Name,
		PublicKey: input.PublicKey,
	}).Extract()
}

func (i *Keypair) Delete(name string) error {
	return keypairs.Delete(i.Client, name, nil).ExtractErr()
}
