package ostack

import (
	"github.com/gophercloud/gophercloud"
	"github.com/gophercloud/gophercloud/openstack"
	"github.com/spf13/viper"
)

type Provider struct {
	*gophercloud.ProviderClient
}

func Connect(username string, password string, tenantID string) *Provider {
	opts := gophercloud.AuthOptions{
		IdentityEndpoint: viper.GetString("OPENSTACK_HOST"),
		Username:         username,
		Password:         password,
		TenantID:         tenantID,
		AllowReauth:      true,
	}
	_client, err := openstack.AuthenticatedClient(opts)
	if err != nil {
		panic(err)
	}
	return &Provider{ProviderClient: _client}
}
