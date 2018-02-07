import React, { Component } from 'react'
import { connect } from 'react-redux'
import {fetchOrders, updateStatus} from '../store';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
const styles = {
  customWidth: {
    width: 150,
  },
};

export class AdminOrders extends Component {
  constructor(props) {
    super(props)
    this.state = {
        expanded: false,
        statusOptions: ['cart', 'pending', 'paid']
    };
  }

  componentDidMount() {
    this.props.getOrders()
  }
 handleToggle = (event, toggled) => {
    this.setState({
      [event.target.name]: toggled,
    });
  };

  handleChange = (event) => {
    this.setState({height: event.target.value});
  };
  handleUpdate = (event, id, value) => {
    event.preventDefault()
    console.log('value', id,  value)
    this.props.updateOrder(id, value)
  }
  render() {
    console.log('gthis is rendering', this.props.orders)
    
    return (
      <div style={{display: 'flex',  justifyContent: 'center'}}>
            <Table style={{width: '70vw'}}>
            <TableHeader>
              <TableRow>
                <TableHeaderColumn>Order ID</TableHeaderColumn>
                <TableHeaderColumn>Status</TableHeaderColumn>
                <TableHeaderColumn>User</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody>
            {
              this.props.orders && this.props.orders.map(order => {
                  return (
                  <TableRow key={order.id}>
                    <TableRowColumn>
                    <Card>
                    <CardHeader
                      title={"Order " + order.id + ' - ' + order.user.first + ' ' + order.user.last}
                      subtitle={"Status: " + order.status}
                      actAsExpander={true}
                      showExpandableButton={true}
                    />
                    <CardText expandable={true}>
                    <ul>
                    {
                      order.lineItems.map(item => {
                        return (
                        <div>
                          <li>
                            <div>{item.product.name}</div>
                            <div>{'quantity' + ': ' + item.qty}</div>
                            <div>{'total item price: ' + item.purchasePrice}</div>
                          </li>
                        </div>
                         
                          
                        )
                      })
                    }
                    <h4>Total: {order.lineItems.length > 0 && order.lineItems.map(item => item.purchasePrice * item.qty).reduce((a,b) => a+b)}</h4>
                    <SelectField
                    floatingLabelText="Change Order Status"
                    value={order.status}
                    onChange={(e, id, value) => this.handleUpdate(e, order.id, value)}
                  >
                    <MenuItem value={this.state.statusOptions[0]} primaryText="cart" />
                    <MenuItem value={this.state.statusOptions[1]} primaryText="pending" />
                    <MenuItem value={this.state.statusOptions[2]} primaryText="paid" />
                  </SelectField>
                    </ul>
                      
                    </CardText>
                  </Card>
                    </TableRowColumn>
                
                  </TableRow>
                  )
              })
            }
             
            </TableBody>
          </Table>
        </div>
          )
      }
}

const mapStateToProps = (state) => ({
    orders: state.adminOrders
})

const mapDispatchToProps = dispatch => ({
    getOrders() {
      dispatch(fetchOrders())
    },
    updateOrder(orderId, status) {
      dispatch(updateStatus(orderId, status))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(AdminOrders);