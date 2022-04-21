package ostack

import (
	"github.com/Fibocloud/Sol/backend/db"
	"github.com/gophercloud/gophercloud"
	"github.com/gophercloud/gophercloud/openstack"
	"github.com/spf13/viper"
)

type Provider struct {
	*gophercloud.ProviderClient
}

func Connect(credential db.OSCredential) *Provider {
	opts := gophercloud.AuthOptions{
		IdentityEndpoint: viper.GetString("OPENSTACK_HOST"),
		Username:         credential.Username,
		Password:         credential.Password,
		TenantID:         credential.TenantID,
		DomainID:         "default",
		AllowReauth:      true,
	}
	_client, err := openstack.AuthenticatedClient(opts)
	if err != nil {
		panic(err)
	}
	return &Provider{ProviderClient: _client}
}
